export declare class CreateJobDto {
    title: string;
    description: string;
    posterCompany?: string;
    jobType?: string;
    contractType?: string;
    payRangeSol?: string;
    budgetSol?: number;
    skills?: string[];
    chains?: string[];
    requirements?: string[];
    location?: string;
    duration?: string;
    category?: string;
    posterEmail?: string;
    submissionDestination?: string;
}
export declare class UpdateJobDto {
    title?: string;
    description?: string;
    status?: string;
}
export declare class ApplyJobDto {
    coverLetter: string;
    proposedRateSol?: number;
    portfolioUrl?: string;
}
export declare class UpdateApplicationDto {
    status: string;
}
