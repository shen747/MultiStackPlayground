import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../entities/report.entity';
import { GetAllReportsQuery } from '../get-all-reports.query';

@QueryHandler(GetAllReportsQuery)
export class GetAllReportsHandler implements IQueryHandler<GetAllReportsQuery> {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async execute(query: GetAllReportsQuery): Promise<{
    reports: Report[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      format,
      search,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reportsRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.createdBy', 'user');

    if (type) {
      queryBuilder.andWhere('report.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('report.status = :status', { status });
    }

    if (format) {
      queryBuilder.andWhere('report.format = :format', { format });
    }

    if (search) {
      queryBuilder.andWhere(
        '(report.name ILIKE :search OR report.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'report.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    const [reports, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('report.createdAt', 'DESC')
      .getManyAndCount();

    return {
      reports,
      total,
      page,
      limit,
    };
  }
}
