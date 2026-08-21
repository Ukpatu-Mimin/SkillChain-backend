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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(q, type) {
        const term = q?.trim();
        if (!term)
            return { users: [], jobs: [], posts: [] };
        const [users, jobs, posts] = await Promise.all([
            (!type || type === 'users')
                ? this.prisma.profile.findMany({
                    where: {
                        OR: [
                            { name: { contains: term, mode: 'insensitive' } },
                            { handle: { contains: term, mode: 'insensitive' } },
                            { title: { contains: term, mode: 'insensitive' } },
                        ],
                    },
                    take: 10,
                    select: { id: true, name: true, handle: true, avatar: true, title: true, isVerified: true, rating: true },
                })
                : Promise.resolve([]),
            (!type || type === 'jobs')
                ? this.prisma.job.findMany({
                    where: {
                        status: 'OPEN',
                        OR: [
                            { title: { contains: term, mode: 'insensitive' } },
                            { description: { contains: term, mode: 'insensitive' } },
                        ],
                    },
                    take: 10,
                    include: { poster: { select: { id: true, name: true, avatar: true } } },
                })
                : Promise.resolve([]),
            (!type || type === 'posts')
                ? this.prisma.post.findMany({
                    where: { content: { contains: term, mode: 'insensitive' } },
                    take: 10,
                    include: { author: { select: { id: true, name: true, handle: true, avatar: true } } },
                })
                : Promise.resolve([]),
        ]);
        return { users, jobs, posts };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map