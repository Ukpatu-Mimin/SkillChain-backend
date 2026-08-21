import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { Profile } from '@prisma/client';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review' })
  create(
    @CurrentUser() user: Profile,
    @Body() dto: { jobId?: string; jobTitle: string; revieweeId: string; rating: number; comment: string },
  ) {
    return this.reviews.create(user.id, dto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get reviews for a user' })
  findByUser(@Param('id') id: string) {
    return this.reviews.findByUser(id);
  }
}
