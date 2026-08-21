import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto, OnboardProfileDto, CreateDocumentDto, UpdateDocumentDto } from './dto/users.dto';
import { Profile } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  // ── Own profile ────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own profile' })
  getMe(@CurrentUser() user: Profile) {
    return this.users.findById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile' })
  updateMe(@CurrentUser() user: Profile, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }

  @Post('me/onboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete onboarding' })
  onboard(@CurrentUser() user: Profile, @Body() dto: OnboardProfileDto) {
    return this.users.completeOnboarding(user.id, dto);
  }

  // ── Documents ──────────────────────────────────────

  @Post('me/documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a credential document record' })
  createDoc(@CurrentUser() user: Profile, @Body() dto: CreateDocumentDto) {
    return this.users.createDocument(user.id, dto);
  }

  @Patch('me/documents/:docId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a document' })
  updateDoc(
    @CurrentUser() user: Profile,
    @Param('docId') docId: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.users.updateDocument(user.id, docId, dto);
  }

  @Delete('me/documents/:docId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a document' })
  deleteDoc(@CurrentUser() user: Profile, @Param('docId') docId: string) {
    return this.users.deleteDocument(user.id, docId);
  }

  // ── Public user endpoints ──────────────────────────

  @Get()
  @ApiOperation({ summary: 'Search / discover users' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  findMany(
    @Query('q') q?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.users.findMany(q ?? '', limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public profile by ID' })
  findOne(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Follow or unfollow a user' })
  follow(@CurrentUser() user: Profile, @Param('id') targetId: string) {
    return this.users.toggleFollow(user.id, targetId);
  }
}
