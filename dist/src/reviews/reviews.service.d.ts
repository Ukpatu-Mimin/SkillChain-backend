import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(reviewerId: string, dto: {
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
    findByUser(userId: string): Promise<({
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
