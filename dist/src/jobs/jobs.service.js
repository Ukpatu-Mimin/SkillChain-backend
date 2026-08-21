"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const JOB_INCLUDE = {
    poster: { select: { id: true, name: true, handle: true, avatar: true, isVerified: true } },
};
let JobsService = class JobsService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async findMany(params) {
        const { q, category, jobType, limit = 20, offset = 0 } = params;
        return this.prisma.job.findMany({
            where: {
                status: client_1.JobStatus.OPEN,
                ...(category && { category }),
                ...(jobType && { jobType: jobType }),
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
    async findById(id) {
        const job = await this.prisma.job.findUnique({ where: { id }, include: JOB_INCLUDE });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return job;
    }
    async create(posterId, dto) {
        return this.prisma.job.create({
            data: {
                posterId,
                title: dto.title,
                description: dto.description,
                posterCompany: dto.posterCompany,
                jobType: dto.jobType ?? client_1.JobType.REMOTE,
                contractType: dto.contractType ?? client_1.ContractType.CONTRACT,
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
    async update(userId, jobId, dto) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        if (job.posterId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.job.update({ where: { id: jobId }, data: dto, include: JOB_INCLUDE });
    }
    async delete(userId, jobId) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        if (job.posterId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.job.update({ where: { id: jobId }, data: { status: client_1.JobStatus.CLOSED } });
        return { closed: true };
    }
    async toggleSave(userId, jobId) {
        const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
        if (!profile)
            throw new common_1.NotFoundException();
        const saved = profile.savedJobIds.includes(jobId);
        const updatedIds = saved
            ? profile.savedJobIds.filter((id) => id !== jobId)
            : [...profile.savedJobIds, jobId];
        await this.prisma.profile.update({ where: { id: userId }, data: { savedJobIds: updatedIds } });
        return { saved: !saved };
    }
    async apply(userId, jobId, dto) {
        const existing = await this.prisma.jobApplication.findFirst({
            where: { jobId, applicantId: userId },
        });
        if (existing)
            throw new common_1.ConflictException('Already applied to this job');
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
    async getApplications(userId, jobId) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job)
            throw new common_1.NotFoundException();
        if (job.posterId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.jobApplication.findMany({
            where: { jobId },
            include: {
                applicant: { select: { id: true, name: true, handle: true, avatar: true, title: true, rating: true } },
            },
        });
    }
    async updateApplicationStatus(userId, jobId, appId, dto) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job)
            throw new common_1.NotFoundException();
        if (job.posterId !== userId)
            throw new common_1.ForbiddenException();
        const app = await this.prisma.jobApplication.update({
            where: { id: appId },
            data: { status: dto.status },
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
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map