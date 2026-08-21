import { SearchService } from './search.service';
export declare class SearchController {
    private search;
    constructor(search: SearchService);
    query(q: string, type?: 'users' | 'jobs' | 'posts'): Promise<{
        users: never[] | {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
            title: string | null;
            isVerified: boolean;
            rating: number;
        }[];
        jobs: never[] | ({
            poster: {
                id: string;
                name: string;
                avatar: string | null;
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
        })[];
        posts: never[] | ({
            author: {
                id: string;
                name: string;
                handle: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.PostType;
            content: string;
            hashtags: string[];
            mediaUrls: string[];
            jobSkills: string[];
            budgetSol: number | null;
            authorId: string;
            likesCount: number;
            commentsCount: number;
            repostsCount: number;
            jobId: string | null;
        })[];
    }>;
}
