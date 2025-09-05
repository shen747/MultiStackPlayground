import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { ReportingCqrsController } from './reporting-cqrs.controller';
import { Report } from './entities/report.entity';
import { User } from '../users/entities/user.entity';

// Command Handlers
import { CreateReportHandler } from './commands/handlers/create-report.handler';
import { GenerateReportHandler } from './commands/handlers/generate-report.handler';
import { UpdateReportHandler } from './commands/handlers/update-report.handler';
import { DeleteReportHandler } from './commands/handlers/delete-report.handler';

// Query Handlers
import { GetReportHandler } from './queries/handlers/get-report.handler';
import { GetAllReportsHandler } from './queries/handlers/get-all-reports.handler';
import { GetReportStatsHandler } from './queries/handlers/get-report-stats.handler';
import { DownloadReportHandler } from './queries/handlers/download-report.handler';

const CommandHandlers = [
  CreateReportHandler,
  GenerateReportHandler,
  UpdateReportHandler,
  DeleteReportHandler,
];

const QueryHandlers = [
  GetReportHandler,
  GetAllReportsHandler,
  GetReportStatsHandler,
  DownloadReportHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([Report, User]), CqrsModule],
  controllers: [ReportingController, ReportingCqrsController],
  providers: [ReportingService, ...CommandHandlers, ...QueryHandlers],
  exports: [ReportingService],
})
export class ReportingModule {}
