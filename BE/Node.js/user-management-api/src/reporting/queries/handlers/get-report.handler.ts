import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../entities/report.entity';
import { GetReportQuery } from '../get-report.query';

@QueryHandler(GetReportQuery)
export class GetReportHandler implements IQueryHandler<GetReportQuery> {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(query: GetReportQuery): Promise<Report> {
    const { id } = query;

    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }
}
