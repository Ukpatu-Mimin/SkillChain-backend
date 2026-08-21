import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private cfg;
    readonly client: SupabaseClient;
    constructor(cfg: ConfigService);
    sendOtp(email: string): Promise<void>;
    verifyOtp(email: string, token: string): Promise<{
        user: import("@supabase/supabase-js").AuthUser | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    getUser(accessToken: string): Promise<import("@supabase/supabase-js").AuthUser>;
}
