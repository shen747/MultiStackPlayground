import { ReportStatus } from '../entities/report.entity';

export class UpdateReportCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly status?: ReportStatus,
    public readonly data?: Record<string, any>,
    public readonly filePath?: string,
  ) {}
}
