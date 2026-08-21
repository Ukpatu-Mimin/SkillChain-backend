import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommunitiesService } from './communities.service';
import { Profile } from '@prisma/client';

@ApiTags('Communities')
@Controller('communities')
export class CommunitiesController {
  constructor(private communities: CommunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all community groups' })
  findAll() { return this.communities.findAll(); }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a community group' })
  create(
    @CurrentUser() user: Profile,
    @Body() dto: { name: string; description: string; category: string; iconType?: string },
  ) {
    return this.communities.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group detail' })
  findOne(@Param('id') id: string) { return this.communities.findById(id); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update group settings (admin only)' })
  update(
    @CurrentUser() user: Profile,
    @Param('id') id: string,
    @Body() dto: { name?: string; description?: string; isLocked?: boolean },
  ) {
    return this.communities.update(user.id, id, dto);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join or request to join a group' })
  join(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.communities.join(user.id, id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a group' })
  leave(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.communities.leave(user.id, id);
  }

  @Post(':id/members/:uid/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a join request (admin only)' })
  approve(@CurrentUser() user: Profile, @Param('id') id: string, @Param('uid') uid: string) {
    return this.communities.approveJoin(user.id, id, uid);
  }

  @Delete(':id/members/:uid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a member (admin only)' })
  removeMember(@CurrentUser() user: Profile, @Param('id') id: string, @Param('uid') uid: string) {
    return this.communities.removeMember(user.id, id, uid);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get message history for a group' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'before', required: false })
  getMessages(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    return this.communities.getMessages(id, limit, before);
  }

  @Post(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message to a group (REST fallback)' })
  sendMessage(
    @CurrentUser() user: Profile,
    @Param('id') id: string,
    @Body('text') text: string,
  ) {
    return this.communities.sendMessage(user.id, id, text);
  }
}
