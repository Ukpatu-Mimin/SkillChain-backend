import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, ApplyJobDto, UpdateApplicationDto } from './dto/jobs.dto';
import { Profile } from '@prisma/client';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private jobs: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter jobs' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'jobType', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  findMany(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('jobType') jobType?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.jobs.findMany({ q, category, jobType, limit, offset });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post a new job' })
  create(@CurrentUser() user: Profile, @Body() dto: CreateJobDto) {
    return this.jobs.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job detail' })
  findOne(@Param('id') id: string) {
    return this.jobs.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own job' })
  update(@CurrentUser() user: Profile, @Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobs.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close own job' })
  delete(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.jobs.delete(user.id, id);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle save a job' })
  save(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.jobs.toggleSave(user.id, id);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply to a job' })
  apply(@CurrentUser() user: Profile, @Param('id') id: string, @Body() dto: ApplyJobDto) {
    return this.jobs.apply(user.id, id, dto);
  }

  @Get(':id/applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get applications for own job' })
  getApplications(@CurrentUser() user: Profile, @Param('id') id: string) {
    return this.jobs.getApplications(user.id, id);
  }

  @Patch(':id/applications/:aid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status' })
  updateApplicationStatus(
    @CurrentUser() user: Profile,
    @Param('id') id: string,
    @Param('aid') aid: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.jobs.updateApplicationStatus(user.id, id, aid, dto);
  }
}
