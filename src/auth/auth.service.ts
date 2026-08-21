import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from './supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  /**
   * Send OTP to the provided email via Supabase Auth.
   * Also checks/stores handle uniqueness before sending.
   */
  async requestOtp(email: string, username: string): Promise<void> {
    // Check handle uniqueness (case-insensitive)
    const existing = await this.prisma.profile.findFirst({
      where: {
        handle: { equals: username, mode: 'insensitive' },
        NOT: { email },
      },
    });
    if (existing) {
      throw new ConflictException('Username is already taken');
    }

    await this.supabase.sendOtp(email);
  }

  /**
   * Verify the OTP. On first login, auto-create a Profile row.
   * Returns the Supabase session (access_token + refresh_token).
   */
  async verifyOtp(email: string, token: string, username?: string) {
    let data: Awaited<ReturnType<typeof this.supabase.verifyOtp>>;
    try {
      data = await this.supabase.verifyOtp(email, token);
    } catch {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const { user, session } = data;
    if (!user || !session) {
      throw new UnauthorizedException('OTP verification failed');
    }

    // Upsert profile — create on first sign-in
    await this.prisma.profile.upsert({
      where: { supabaseId: user.id },
      update: { isOnline: true },
      create: {
        supabaseId: user.id,
        email: user.email!,
        handle: username ?? email.split('@')[0],
        name: username ?? email.split('@')[0],
      },
    });

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in,
    };
  }

  /**
   * Refresh an access token using the Supabase refresh token.
   */
  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabase.client.auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (error || !data.session) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }

  /**
   * Sign out — revoke Supabase session.
   */
  async logout(accessToken: string): Promise<void> {
    const userClient = this.supabase.client;
    await userClient.auth.admin.signOut(accessToken);
  }
}
