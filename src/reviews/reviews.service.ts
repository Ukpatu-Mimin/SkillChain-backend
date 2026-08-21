import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    reviewerId: string,
    dto: { jobId?: string; jobTitle: string; revieweeId: string; rating: number; comment: string },
  ) {
    const review = await this.prisma.review.create({
      data: {
        reviewerId,
        revieweeId: dto.revieweeId,
        jobId: dto.jobId,
        jobTitle: dto.jobTitle,
        rating: dto.rating,
        comment: dto.comment,
        verifiedOnChain: false,
      },
    });
    // Update reviewee aggregate rating
    const reviews = await this.prisma.review.findMany({ where: { revieweeId: dto.revieweeId } });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.prisma.profile.update({
      where: { id: dto.revieweeId },
      data: { rating: parseFloat(avg.toFixed(2)), reviewCount: reviews.length },
    });
    return review;
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, name: true, avatar: true, handle: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
