import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor(private cfg: ConfigService) {
    this.client = createClient(
      cfg.getOrThrow<string>('SUPABASE_URL'),
      cfg.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  /**
   * Send a magic-link / OTP email via Supabase Auth.
   */
  async sendOtp(email: string): Promise<void> {
    const { error } = await this.client.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  }

  /**
   * Verify the OTP token submitted by the user.
   * Returns the Supabase user and session on success.
   */
  async verifyOtp(email: string, token: string) {
    const { data, error } = await this.client.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;
    return data;
  }

  /**
   * Retrieve the user from a Supabase access token (for JWT validation).
   */
  async getUser(accessToken: string) {
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error) throw error;
    return data.user;
  }
}
