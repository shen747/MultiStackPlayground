import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import * as fs from 'fs';

// Commands
import { CreateReportCommand } from './commands/create-report.command';
import { GenerateReportCommand } from './commands/generate-report.command';
import { UpdateReportCommand } from './commands/update-report.command';
import { DeleteReportCommand } from './commands/delete-report.command';

// Queries
import { GetReportQuery } from './queries/get-report.query';
import { GetAllReportsQuery } from './queries/get-all-reports.query';
import { GetReportStatsQuery } from './queries/get-report-stats.query';
import { DownloadReportQuery } from './queries/download-report.query';

// DTOs
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportFilterDto } from './dto/report-filter.dto';

@Controller('reports-cqrs')
@UseGuards(JwtAuthGuard)
export class ReportingCqrsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto, @Request() req) {
    const command = new CreateReportCommand(
      createReportDto.name,
      createReportDto.description,
      createReportDto.type,
      createReportDto.format,
      createReportDto.parameters || {},
      req.user.id,
      createReportDto.expiresAt
        ? new Date(createReportDto.expiresAt)
        : undefined,
    );
    return this.commandBus.execute(command);
  }

  @Get()
  async findAll(@Query() filters: ReportFilterDto) {
    const query = new GetAllReportsQuery(
      filters.page,
      filters.limit,
      filters.type,
      filters.status,
      filters.format,
      filters.search,
      filters.startDate,
      filters.endDate,
    );
    return this.queryBus.execute(query);
  }

  @Get('stats')
  async getStats() {
    const query = new GetReportStatsQuery();
    return this.queryBus.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = new GetReportQuery(id);
    return this.queryBus.execute(query);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const command = new UpdateReportCommand(
      id,
      updateReportDto.name,
      updateReportDto.description,
      updateReportDto.status,
    );
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const command = new DeleteReportCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Report deleted successfully' };
  }

  @Post('generate')
  async generateReport(
    @Body() generateReportDto: GenerateReportDto,
    @Request() req,
  ) {
    const command = new GenerateReportCommand(
      generateReportDto.name,
      generateReportDto.description,
      generateReportDto.type,
      generateReportDto.format,
      generateReportDto.parameters || {},
      req.user.id,
      generateReportDto.startDate
        ? new Date(generateReportDto.startDate)
        : undefined,
      generateReportDto.endDate
        ? new Date(generateReportDto.endDate)
        : undefined,
      generateReportDto.expiresAt
        ? new Date(generateReportDto.expiresAt)
        : undefined,
    );
    return this.commandBus.execute(command);
  }

  @Get(':id/download')
  async downloadReport(@Param('id') id: string, @Res() res: Response) {
    try {
      const query = new DownloadReportQuery(id);
      const { filePath, fileName } = await this.queryBus.execute(query);

      if (!fs.existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Report file not found',
        });
      }

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('Content-Type', 'application/octet-stream');

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
