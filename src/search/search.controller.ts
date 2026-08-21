import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private search: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search across users, jobs, and posts' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'type', required: false, enum: ['users', 'jobs', 'posts'] })
  query(
    @Query('q') q: string,
    @Query('type') type?: 'users' | 'jobs' | 'posts',
  ) {
    return this.search.search(q, type);
  }
}
