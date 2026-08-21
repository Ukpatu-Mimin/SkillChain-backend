import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from './supabase.service';
export declare class AuthService {
    private prisma;
    private supabase;
    constructor(prisma: PrismaService, supabase: SupabaseService);
    requestOtp(email: string, username: string): Promise<void>;
    verifyOtp(email: string, token: string, username?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(accessToken: string): Promise<void>;
}
