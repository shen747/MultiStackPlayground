const sql = require('mssql');

const config = {
  server: 'localhost',
  user: 'ramesh',
  password: 'YourStrongPassword123!',
  database: 'user_management',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function testConnection() {
  try {
    console.log('Attempting to connect to SQL Server...');
    await sql.connect(config);
    console.log('✅ Connection successful!');

    const result = await sql.query('SELECT @@VERSION as version');
    console.log('SQL Server version:', result.recordset[0].version);

    await sql.close();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
