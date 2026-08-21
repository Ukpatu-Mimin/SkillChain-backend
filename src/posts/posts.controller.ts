import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { Profile } from '@prisma/client';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Paginated post feed' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  findMany(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('authorId') authorId?: string,
  ) {
    return this.posts.findMany(limit, offset, authorId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a post' })
  create(@CurrentUser() user: Profile, @Body() dto: CreatePostDto) {
    return this.posts.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit own post' })
  update(@CurrentUser() user: Profile, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.posts.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete own post' })
  delete(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.posts.delete(user.id, id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a post' })
  like(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.posts.toggleLike(user.id, id);
  }

  @Post(':id/repost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle repost' })
  repost(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.posts.toggleRepost(user.id, id);
  }

  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle bookmark' })
  bookmark(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.posts.toggleBookmark(user.id, id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  getComments(@Param('id') id: string) {
    return this.posts.getComments(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment' })
  addComment(
    @CurrentUser() user: Profile,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.posts.addComment(user.id, id, content);
  }

  @Post(':id/comments/:cid/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a comment' })
  likeComment(@CurrentUser() user: Profile, @Param('cid') cid: string) {
    return this.posts.toggleCommentLike(user.id, cid);
  }
}
