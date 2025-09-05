using Azure.Messaging.ServiceBus;
using System.Text.Json;

namespace UserManagement.API.Services;

public interface IMessageServiceBus
{
    Task SendMessageAsync<T>(T message, string queueName) where T : class;
    Task SendMessageAsync(string message, string queueName);
}

public class MessageServiceBus : IMessageServiceBus, IAsyncDisposable
{
    private readonly ServiceBusClient _client;
    private readonly ILogger<MessageServiceBus> _logger;
    private readonly Dictionary<string, ServiceBusSender> _senders;

    public MessageServiceBus(IConfiguration configuration, ILogger<MessageServiceBus> logger)
    {
        var connectionString = configuration.GetConnectionString("ServiceBus");
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Service Bus connection string is not configured");
        }

        _client = new ServiceBusClient(connectionString);
        _logger = logger;
        _senders = new Dictionary<string, ServiceBusSender>();
    }

    public async Task SendMessageAsync<T>(T message, string queueName) where T : class
    {
        try
        {
            var jsonMessage = JsonSerializer.Serialize(message);
            await SendMessageAsync(jsonMessage, queueName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send message of type {MessageType} to queue {QueueName}", 
                typeof(T).Name, queueName);
            throw;
        }
    }

    public async Task SendMessageAsync(string message, string queueName)
    {
        try
        {
            var sender = GetOrCreateSender(queueName);
            var serviceBusMessage = new ServiceBusMessage(message)
            {
                ContentType = "application/json",
                MessageId = Guid.NewGuid().ToString()
            };

            await sender.SendMessageAsync(serviceBusMessage);
            _logger.LogInformation("Message sent successfully to queue {QueueName}", queueName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send message to queue {QueueName}", queueName);
            throw;
        }
    }

    private ServiceBusSender GetOrCreateSender(string queueName)
    {
        if (!_senders.ContainsKey(queueName))
        {
            _senders[queueName] = _client.CreateSender(queueName);
        }
        return _senders[queueName];
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var sender in _senders.Values)
        {
            await sender.DisposeAsync();
        }
        _senders.Clear();

        if (_client != null)
        {
            await _client.DisposeAsync();
        }
    }
}
