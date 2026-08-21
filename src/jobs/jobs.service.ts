import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus, JobType, ContractType, ApplicationStatus } from '@prisma/client';
import { CreateJobDto, UpdateJobDto, ApplyJobDto, UpdateApplicationDto } from './dto/jobs.dto';
import { NotificationsService } from '../notifications/notifications.service';

const JOB_INCLUDE = {
  poster: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true } },
};

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findMany(params: { q?: string; category?: string; jobType?: string; limit?: number; offset?: number }) {
    const { q, category, jobType, limit = 20, offset = 0 } = params;
    return this.prisma.job.findMany({
      where: {
        status: JobStatus.OPEN,
        ...(category && { category }),
        ...(jobType && { jobType: jobType as JobType }),
        ...(q && {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }),
      },
      include: JOB_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findById(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id }, include: JOB_INCLUDE });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async create(posterId: string, dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        posterId,
        title: dto.title,
        description: dto.description,
        posterCompany: dto.posterCompany,
        jobType: (dto.jobType as JobType) ?? JobType.REMOTE,
        contractType: (dto.contractType as ContractType) ?? ContractType.CONTRACT,
        payRangeSol: dto.payRangeSol,
        budgetSol: dto.budgetSol ?? 0,
        skills: dto.skills ?? [],
        chains: dto.chains ?? [],
        requirements: dto.requirements ?? [],
        location: dto.location,
        duration: dto.duration,
        category: dto.category,
        posterEmail: dto.posterEmail,
        submissionDestination: dto.submissionDestination,
      },
      include: JOB_INCLUDE,
    });
  }

  async update(userId: string, jobId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.posterId !== userId) throw new ForbiddenException();
    return this.prisma.job.update({ where: { id: jobId }, data: dto as any, include: JOB_INCLUDE });
  }

  async delete(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.posterId !== userId) throw new ForbiddenException();
    await this.prisma.job.update({ where: { id: jobId }, data: { status: JobStatus.CLOSED } });
    return { closed: true };
  }

  async toggleSave(userId: string, jobId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) throw new NotFoundException();
    const saved = profile.savedJobIds.includes(jobId);
    const updatedIds = saved
      ? profile.savedJobIds.filter((id) => id !== jobId)
      : [...profile.savedJobIds, jobId];
    await this.prisma.profile.update({ where: { id: userId }, data: { savedJobIds: updatedIds } });
    return { saved: !saved };
  }

  async apply(userId: string, jobId: string, dto: ApplyJobDto) {
    const existing = await this.prisma.jobApplication.findFirst({
      where: { jobId, applicantId: userId },
    });
    if (existing) throw new ConflictException('Already applied to this job');
    const application = await this.prisma.jobApplication.create({
      data: {
        jobId,
        applicantId: userId,
        coverLetter: dto.coverLetter,
        proposedRateSol: dto.proposedRateSol ?? 0,
        portfolioUrl: dto.portfolioUrl,
      },
    });
    await this.prisma.job.update({ where: { id: jobId }, data: { applicantsCount: { increment: 1 } } });
    // Notify job poster
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (job) {
      await this.notifications.create(job.posterId, {
        type: 'job_status',
        title: 'New Applicant',
        message: `Someone applied to "${job.title}"`,
        targetId: jobId,
        linkTab: 'jobs',
      });
    }
    return application;
  }

  async getApplications(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException();
    if (job.posterId !== userId) throw new ForbiddenException();
    return this.prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        applicant: { select: { id: true, name: true, handle: true, avatar: true, title: true, rating: true } },
      },
    });
  }

  async updateApplicationStatus(userId: string, jobId: string, appId: string, dto: UpdateApplicationDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException();
    if (job.posterId !== userId) throw new ForbiddenException();
    const app = await this.prisma.jobApplication.update({
      where: { id: appId },
      data: { status: dto.status as ApplicationStatus },
    });
    await this.notifications.create(app.applicantId, {
      type: 'job_status',
      title: 'Application Update',
      message: `Your application status: ${dto.status}`,
      targetId: jobId,
      linkTab: 'jobs',
    });
    return app;
  }
}
