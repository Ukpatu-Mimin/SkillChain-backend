"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_service_1 = require("./supabase.service");
let AuthService = class AuthService {
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    async requestOtp(email, username) {
        const existing = await this.prisma.profile.findFirst({
            where: {
                handle: { equals: username, mode: 'insensitive' },
                NOT: { email },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Username is already taken');
        }
        await this.supabase.sendOtp(email);
    }
    async verifyOtp(email, token, username) {
        let data;
        try {
            data = await this.supabase.verifyOtp(email, token);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        const { user, session } = data;
        if (!user || !session) {
            throw new common_1.UnauthorizedException('OTP verification failed');
        }
        await this.prisma.profile.upsert({
            where: { supabaseId: user.id },
            update: { isOnline: true },
            create: {
                supabaseId: user.id,
                email: user.email,
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
    async refreshToken(refreshToken) {
        const { data, error } = await this.supabase.client.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error || !data.session) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresIn: data.session.expires_in,
        };
    }
    async logout(accessToken) {
        const userClient = this.supabase.client;
        await userClient.auth.admin.signOut(accessToken);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map