import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UploadsService } from './uploads.service';
import { Profile } from '@prisma/client';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private uploads: UploadsService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Get a Supabase Storage signed upload URL' })
  presign(
    @CurrentUser() user: Profile,
    @Body() dto: { bucket: 'avatars' | 'documents' | 'portfolio'; fileName: string },
  ) {
    return this.uploads.getSignedUploadUrl(dto.bucket, dto.fileName, user.id);
  }
}
