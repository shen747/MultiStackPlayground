import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../entities/report.entity';
import { DeleteReportCommand } from '../delete-report.command';
import * as fs from 'fs';

@CommandHandler(DeleteReportCommand)
export class DeleteReportHandler
  implements ICommandHandler<DeleteReportCommand>
{
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(command: DeleteReportCommand): Promise<void> {
    const { id } = command;

    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Delete file if it exists
    if (report.filePath && fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }

    await this.reportsRepository.remove(report);
  }
}
