import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../../entities/report.entity';
import { GenerateReportCommand } from '../generate-report.command';

@CommandHandler(GenerateReportCommand)
export class GenerateReportHandler
  implements ICommandHandler<GenerateReportCommand>
{
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(command: GenerateReportCommand): Promise<Report> {
    const {
      name,
      description,
      type,
      format,
      parameters,
      createdById,
      expiresAt,
    } = command;

    const report = this.reportsRepository.create({
      name,
      description,
      type,
      format,
      parameters,
      createdById,
      expiresAt,
      status: ReportStatus.GENERATING,
    });

    const savedReport = await this.reportsRepository.save(report);

    // In a real implementation, you would trigger the report generation process here
    // For now, we'll just return the created report
    return savedReport;
  }
}
