import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../../entities/report.entity';
import { CreateReportCommand } from '../create-report.command';

@CommandHandler(CreateReportCommand)
export class CreateReportHandler
  implements ICommandHandler<CreateReportCommand>
{
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(command: CreateReportCommand): Promise<Report> {
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
      status: ReportStatus.PENDING,
    });

    return this.reportsRepository.save(report);
  }
}
