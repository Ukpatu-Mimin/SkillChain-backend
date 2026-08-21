import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, ApplyJobDto, UpdateApplicationDto } from './dto/jobs.dto';
import { Profile } from '@prisma/client';
export declare class JobsController {
    private jobs;
    constructor(jobs: JobsService);
    findMany(q?: string, category?: string, jobType?: string, limit?: number, offset?: number): Promise<({
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
    create(user: Profile, dto: CreateJobDto): Promise<{
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
    findOne(id: string): Promise<{
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
    update(user: Profile, id: string, dto: UpdateJobDto): Promise<{
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
    delete(user: Profile, id: string): Promise<{
        closed: boolean;
    }>;
    save(user: Profile, id: string): Promise<{
        saved: boolean;
    }>;
    apply(user: Profile, id: string, dto: ApplyJobDto): Promise<{
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
    getApplications(user: Profile, id: string): Promise<({
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
    updateApplicationStatus(user: Profile, id: string, aid: string, dto: UpdateApplicationDto): Promise<{
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
