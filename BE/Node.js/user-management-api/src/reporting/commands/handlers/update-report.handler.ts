import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../entities/report.entity';
import { UpdateReportCommand } from '../update-report.command';

@CommandHandler(UpdateReportCommand)
export class UpdateReportHandler
  implements ICommandHandler<UpdateReportCommand>
{
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(command: UpdateReportCommand): Promise<Report> {
    const { id, name, description, status, data, filePath } = command;

    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (name !== undefined) report.name = name;
    if (description !== undefined) report.description = description;
    if (status !== undefined) report.status = status;
    if (data !== undefined) report.data = data;
    if (filePath !== undefined) report.filePath = filePath;

    return this.reportsRepository.save(report);
  }
}
