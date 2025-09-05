import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import {
  Report,
  ReportType,
  ReportStatus,
  ReportFormat,
} from './entities/report.entity';
import { User } from '../users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportFilterDto } from './dto/report-filter.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    createdById: string,
  ): Promise<Report> {
    const report = this.reportsRepository.create({
      ...createReportDto,
      createdById,
      status: ReportStatus.PENDING,
    });

    return this.reportsRepository.save(report);
  }

  async findAll(filters: ReportFilterDto): Promise<{
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
    } = filters;
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

  async findOne(id: string): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);

    Object.assign(report, updateReportDto);
    return this.reportsRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    const report = await this.findOne(id);

    // Delete file if it exists
    if (report.filePath && fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }

    await this.reportsRepository.remove(report);
  }

  async generateReport(
    generateReportDto: GenerateReportDto,
    createdById: string,
  ): Promise<Report> {
    const report = this.reportsRepository.create({
      ...generateReportDto,
      createdById,
      status: ReportStatus.GENERATING,
    });

    const savedReport = await this.reportsRepository.save(report);

    // Generate report data asynchronously
    this.generateReportData(savedReport.id).catch((error) => {
      console.error('Error generating report:', error);
      this.updateReportStatus(savedReport.id, ReportStatus.FAILED);
    });

    return savedReport;
  }

  private async generateReportData(reportId: string): Promise<void> {
    const report = await this.findOne(reportId);

    try {
      let data: any;

      switch (report.type) {
        case ReportType.USER_ANALYTICS:
          data = await this.generateUserAnalyticsReport(report.parameters);
          break;
        case ReportType.USER_REGISTRATION:
          data = await this.generateUserRegistrationReport(report.parameters);
          break;
        case ReportType.USER_ACTIVITY:
          data = await this.generateUserActivityReport(report.parameters);
          break;
        case ReportType.SYSTEM_METRICS:
          data = await this.generateSystemMetricsReport(report.parameters);
          break;
        default:
          throw new BadRequestException('Unsupported report type');
      }

      // Update report with generated data
      report.data = data;
      report.status = ReportStatus.COMPLETED;
      report.generatedAt = new Date();

      // Generate file if needed
      if (report.format !== ReportFormat.JSON) {
        report.filePath = await this.generateReportFile(report);
      }

      await this.reportsRepository.save(report);
    } catch (error) {
      report.status = ReportStatus.FAILED;
      await this.reportsRepository.save(report);
      throw error;
    }
  }

  private async updateReportStatus(
    reportId: string,
    status: ReportStatus,
  ): Promise<void> {
    await this.reportsRepository.update(reportId, { status });
  }

  private async generateUserAnalyticsReport(parameters: any): Promise<any> {
    const { startDate, endDate } = parameters || {};

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (startDate && endDate) {
      queryBuilder.where('user.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({
      where: { isActive: true },
    });
    const inactiveUsers = await this.usersRepository.count({
      where: { isActive: false },
    });

    // Registration trends by month
    const registrationTrends = await this.usersRepository
      .createQueryBuilder('user')
      .select("DATE_TRUNC('month', user.createdAt)", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy("DATE_TRUNC('month', user.createdAt)")
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      summary: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        activePercentage: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      },
      registrationTrends,
      generatedAt: new Date(),
    };
  }

  private async generateUserRegistrationReport(parameters: any): Promise<any> {
    const { startDate, endDate } = parameters || {};

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (startDate && endDate) {
      queryBuilder.where('user.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const users = await queryBuilder
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.createdAt',
      ])
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return {
      users,
      totalCount: users.length,
      generatedAt: new Date(),
    };
  }

  private async generateUserActivityReport(parameters: any): Promise<any> {
    // This would typically integrate with activity logs
    // For now, we'll return basic user activity data
    const activeUsers = await this.usersRepository.find({
      where: { isActive: true },
      select: ['id', 'email', 'firstName', 'lastName', 'lastLoginAt'],
    });

    return {
      activeUsers,
      totalActiveUsers: activeUsers.length,
      generatedAt: new Date(),
    };
  }

  private async generateSystemMetricsReport(parameters: any): Promise<any> {
    const totalUsers = await this.usersRepository.count();
    const totalReports = await this.reportsRepository.count();

    const reportsByType = await this.reportsRepository
      .createQueryBuilder('report')
      .select('report.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('report.type')
      .getRawMany();

    return {
      systemMetrics: {
        totalUsers,
        totalReports,
        reportsByType,
      },
      generatedAt: new Date(),
    };
  }

  private async generateReportFile(report: Report): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'reports');

    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${report.id}-${Date.now()}.${report.format}`;
    const filePath = path.join(uploadsDir, fileName);

    try {
      switch (report.format) {
        case ReportFormat.CSV:
          await this.generateCSVFile(report.data, filePath);
          break;
        case ReportFormat.JSON:
          fs.writeFileSync(filePath, JSON.stringify(report.data, null, 2));
          break;
        default:
          throw new BadRequestException('Unsupported file format');
      }

      return filePath;
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate report file');
    }
  }

  private async generateCSVFile(data: any, filePath: string): Promise<void> {
    // Simple CSV generation - in production, use a proper CSV library
    let csvContent = '';

    if (data.users && Array.isArray(data.users)) {
      // Generate CSV for user data
      const headers = [
        'ID',
        'Email',
        'First Name',
        'Last Name',
        'Active',
        'Created At',
      ];
      csvContent += headers.join(',') + '\n';

      data.users.forEach((user: any) => {
        const row = [
          user.id,
          user.email,
          user.firstName,
          user.lastName,
          user.isActive,
          user.createdAt,
        ];
        csvContent += row.join(',') + '\n';
      });
    } else {
      // Generate CSV for summary data
      csvContent = JSON.stringify(data, null, 2);
    }

    fs.writeFileSync(filePath, csvContent);
  }

  async downloadReport(
    id: string,
  ): Promise<{ filePath: string; fileName: string }> {
    const report = await this.findOne(id);

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

  async getReportStats(): Promise<any> {
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
