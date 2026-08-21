import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ChatService } from './chat.service';
import { Profile } from '@prisma/client';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List own conversations' })
  getConversations(@CurrentUser() user: Profile) {
    return this.chat.getConversations(user.id);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start a conversation with a user' })
  createConversation(@CurrentUser() user: Profile, @Body('participantId') participantId: string) {
    return this.chat.createConversation(user.id, participantId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'before', required: false, description: 'ISO timestamp cursor for pagination' })
  getMessages(
    @CurrentUser() user: Profile,
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    return this.chat.getMessages(user.id, id, limit, before);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message (REST fallback)' })
  sendMessage(
    @CurrentUser() user: Profile,
    @Param('id') id: string,
    @Body('text') text: string,
  ) {
    return this.chat.sendMessage(user.id, id, text);
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark conversation messages as read' })
  markRead(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.chat.markRead(user.id, id);
  }
}
