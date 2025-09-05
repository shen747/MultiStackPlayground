import {
  ReportType,
  ReportStatus,
  ReportFormat,
} from '../entities/report.entity';

export class GetAllReportsQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly type?: ReportType,
    public readonly status?: ReportStatus,
    public readonly format?: ReportFormat,
    public readonly search?: string,
    public readonly startDate?: string,
    public readonly endDate?: string,
  ) {}
}
