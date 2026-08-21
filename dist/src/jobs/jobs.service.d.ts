import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, ApplyJobDto, UpdateApplicationDto } from './dto/jobs.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class JobsService {
    private prisma;
    private notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    findMany(params: {
        q?: string;
        category?: string;
        jobType?: string;
        limit?: number;
        offset?: number;
    }): Promise<({
        poster: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        title: string;
        skills: string[];
        chains: string[];
        location: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        budgetSol: number;
        posterCompany: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        contractType: import(".prisma/client").$Enums.ContractType;
        payRangeSol: string | null;
        requirements: string[];
        duration: string | null;
        category: string | null;
        posterEmail: string | null;
        submissionDestination: string | null;
        status: import(".prisma/client").$Enums.JobStatus;
        posterId: string;
        applicantsCount: number;
        tag: string | null;
        rateDisplay: string | null;
    })[]>;
    findById(id: string): Promise<{
        poster: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        title: string;
        skills: string[];
        chains: string[];
        location: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        budgetSol: number;
        posterCompany: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        contractType: import(".prisma/client").$Enums.ContractType;
        payRangeSol: string | null;
        requirements: string[];
        duration: string | null;
        category: string | null;
        posterEmail: string | null;
        submissionDestination: string | null;
        status: import(".prisma/client").$Enums.JobStatus;
        posterId: string;
        applicantsCount: number;
        tag: string | null;
        rateDisplay: string | null;
    }>;
    create(posterId: string, dto: CreateJobDto): Promise<{
        poster: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        title: string;
        skills: string[];
        chains: string[];
        location: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        budgetSol: number;
        posterCompany: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        contractType: import(".prisma/client").$Enums.ContractType;
        payRangeSol: string | null;
        requirements: string[];
        duration: string | null;
        category: string | null;
        posterEmail: string | null;
        submissionDestination: string | null;
        status: import(".prisma/client").$Enums.JobStatus;
        posterId: string;
        applicantsCount: number;
        tag: string | null;
        rateDisplay: string | null;
    }>;
    update(userId: string, jobId: string, dto: UpdateJobDto): Promise<{
        poster: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            isVerified: boolean;
        };
    } & {
        id: string;
        title: string;
        skills: string[];
        chains: string[];
        location: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        budgetSol: number;
        posterCompany: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        contractType: import(".prisma/client").$Enums.ContractType;
        payRangeSol: string | null;
        requirements: string[];
        duration: string | null;
        category: string | null;
        posterEmail: string | null;
        submissionDestination: string | null;
        status: import(".prisma/client").$Enums.JobStatus;
        posterId: string;
        applicantsCount: number;
        tag: string | null;
        rateDisplay: string | null;
    }>;
    delete(userId: string, jobId: string): Promise<{
        closed: boolean;
    }>;
    toggleSave(userId: string, jobId: string): Promise<{
        saved: boolean;
    }>;
    apply(userId: string, jobId: string, dto: ApplyJobDto): Promise<{
        id: string;
        updatedAt: Date;
        jobId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        coverLetter: string;
        proposedRateSol: number;
        portfolioUrl: string | null;
        applicantId: string;
        appliedAt: Date;
    }>;
    getApplications(userId: string, jobId: string): Promise<({
        applicant: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            title: string | null;
            rating: number;
        };
    } & {
        id: string;
        updatedAt: Date;
        jobId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        coverLetter: string;
        proposedRateSol: number;
        portfolioUrl: string | null;
        applicantId: string;
        appliedAt: Date;
    })[]>;
    updateApplicationStatus(userId: string, jobId: string, appId: string, dto: UpdateApplicationDto): Promise<{
        id: string;
        updatedAt: Date;
        jobId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        coverLetter: string;
        proposedRateSol: number;
        portfolioUrl: string | null;
        applicantId: string;
        appliedAt: Date;
    }>;
}
