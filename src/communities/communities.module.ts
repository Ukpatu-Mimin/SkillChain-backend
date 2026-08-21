import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { CommunitiesGateway } from './communities.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunitiesGateway],
})
export class CommunitiesModule {}
