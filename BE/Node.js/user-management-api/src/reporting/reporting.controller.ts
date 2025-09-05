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
import { ReportingService } from './reporting.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportFilterDto } from './dto/report-filter.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import * as fs from 'fs';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post()
  async create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.reportingService.create(createReportDto, req.user.id);
  }

  @Get()
  async findAll(@Query() filters: ReportFilterDto) {
    return this.reportingService.findAll(filters);
  }

  @Get('stats')
  async getStats() {
    return this.reportingService.getReportStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportingService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportingService.update(id, updateReportDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reportingService.remove(id);
    return { message: 'Report deleted successfully' };
  }

  @Post('generate')
  async generateReport(
    @Body() generateReportDto: GenerateReportDto,
    @Request() req,
  ) {
    return this.reportingService.generateReport(generateReportDto, req.user.id);
  }

  @Get(':id/download')
  async downloadReport(@Param('id') id: string, @Res() res: Response) {
    try {
      const { filePath, fileName } =
        await this.reportingService.downloadReport(id);

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

  // Predefined report endpoints
  @Post('user-analytics')
  async generateUserAnalytics(
    @Body() body: { startDate?: string; endDate?: string },
    @Request() req,
  ) {
    const generateReportDto: GenerateReportDto = {
      name: 'User Analytics Report',
      description: 'Comprehensive user analytics and statistics',
      type: 'user_analytics' as any,
      format: 'json' as any,
      parameters: {
        startDate: body.startDate,
        endDate: body.endDate,
      },
    };
    return this.reportingService.generateReport(generateReportDto, req.user.id);
  }

  @Post('user-registration')
  async generateUserRegistration(
    @Body() body: { startDate?: string; endDate?: string; format?: string },
    @Request() req,
  ) {
    const generateReportDto: GenerateReportDto = {
      name: 'User Registration Report',
      description: 'List of user registrations',
      type: 'user_registration' as any,
      format: (body.format || 'json') as any,
      parameters: {
        startDate: body.startDate,
        endDate: body.endDate,
      },
    };
    return this.reportingService.generateReport(generateReportDto, req.user.id);
  }

  @Post('user-activity')
  async generateUserActivity(@Request() req) {
    const generateReportDto: GenerateReportDto = {
      name: 'User Activity Report',
      description: 'User activity and engagement metrics',
      type: 'user_activity' as any,
      format: 'json' as any,
      parameters: {},
    };
    return this.reportingService.generateReport(generateReportDto, req.user.id);
  }

  @Post('system-metrics')
  async generateSystemMetrics(@Request() req) {
    const generateReportDto: GenerateReportDto = {
      name: 'System Metrics Report',
      description: 'System performance and usage metrics',
      type: 'system_metrics' as any,
      format: 'json' as any,
      parameters: {},
    };
    return this.reportingService.generateReport(generateReportDto, req.user.id);
  }
}
