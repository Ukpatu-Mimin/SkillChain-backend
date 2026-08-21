import { ReviewsService } from './reviews.service';
import { Profile } from '@prisma/client';
export declare class ReviewsController {
    private reviews;
    constructor(reviews: ReviewsService);
    create(user: Profile, dto: {
        jobId?: string;
        jobTitle: string;
        revieweeId: string;
        rating: number;
        comment: string;
    }): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        verifiedOnChain: boolean;
        txHash: string | null;
        comment: string;
        jobId: string | null;
        jobTitle: string;
        reviewerId: string;
        revieweeId: string;
    }>;
    findByUser(id: string): Promise<({
        reviewer: {
            id: string;
            name: string;
            handle: string;
            avatar: string | null;
        };
    } & {
        id: string;
        rating: number;
        createdAt: Date;
        verifiedOnChain: boolean;
        txHash: string | null;
        comment: string;
        jobId: string | null;
        jobTitle: string;
        reviewerId: string;
        revieweeId: string;
    })[]>;
}
