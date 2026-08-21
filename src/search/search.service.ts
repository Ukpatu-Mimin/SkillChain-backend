import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string, type?: 'users' | 'jobs' | 'posts') {
    const term = q?.trim();
    if (!term) return { users: [], jobs: [], posts: [] };

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
}
