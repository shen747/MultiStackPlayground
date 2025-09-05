import { ReportType, ReportFormat } from '../entities/report.entity';

export class GenerateReportCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly type: ReportType,
    public readonly format: ReportFormat,
    public readonly parameters: Record<string, any>,
    public readonly createdById: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly expiresAt?: Date,
  ) {}
}
