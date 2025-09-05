import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from '../../entities/report.entity';
import { GetReportStatsQuery } from '../get-report-stats.query';

@QueryHandler(GetReportStatsQuery)
export class GetReportStatsHandler
  implements IQueryHandler<GetReportStatsQuery>
{
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(query: GetReportStatsQuery): Promise<any> {
    const totalReports = await this.reportsRepository.count();
    const completedReports = await this.reportsRepository.count({
      where: { status: ReportStatus.COMPLETED },
    });
    const pendingReports = await this.reportsRepository.count({
      where: { status: ReportStatus.PENDING },
    });
    const failedReports = await this.reportsRepository.count({
      where: { status: ReportStatus.FAILED },
    });

    const reportsByType = await this.reportsRepository
      .createQueryBuilder('report')
      .select('report.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('report.type')
      .getRawMany();

    return {
      totalReports,
      completedReports,
      pendingReports,
      failedReports,
      reportsByType,
    };
  }
}
