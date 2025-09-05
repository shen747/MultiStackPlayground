import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../../entities/report.entity';
import { DownloadReportQuery } from '../download-report.query';
import * as fs from 'fs';

@QueryHandler(DownloadReportQuery)
export class DownloadReportHandler
  implements IQueryHandler<DownloadReportQuery>
{
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(
    query: DownloadReportQuery,
  ): Promise<{ filePath: string; fileName: string }> {
    const { id } = query;

    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status !== ReportStatus.COMPLETED) {
      throw new BadRequestException('Report is not ready for download');
    }

    if (!report.filePath || !fs.existsSync(report.filePath)) {
      throw new NotFoundException('Report file not found');
    }

    const fileName = `${report.name}.${report.format}`;

    return {
      filePath: report.filePath,
      fileName,
    };
  }
}
