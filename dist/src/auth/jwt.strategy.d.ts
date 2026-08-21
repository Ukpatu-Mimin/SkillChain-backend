import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(cfg: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        email: string;
        id: string;
        supabaseId: string;
        name: string;
        handle: string;
        avatar: string | null;
        coverImage: string | null;
        title: string | null;
        bio: string | null;
        isVerified: boolean;
        walletAddress: string | null;
        hourlyRateSol: number;
        preferredCurrency: import(".prisma/client").$Enums.PreferredCurrency;
        rating: number;
        reviewCount: number;
        skills: string[];
        chains: string[];
        role: import(".prisma/client").$Enums.UserRole;
        isOnline: boolean;
        location: string | null;
        jobTypes: string[];
        completedJobsCount: number;
        totalEarnedSol: number;
        githubUrl: string | null;
        twitterUrl: string | null;
        isOnboarded: boolean;
        savedJobIds: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
