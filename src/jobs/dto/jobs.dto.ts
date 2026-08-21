import { IsString, IsOptional, IsArray, IsNumber, IsEnum, IsEmail, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() posterCompany?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['REMOTE','HYBRID','ON_SITE']) jobType?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['CONTRACT','FULL_TIME','PART_TIME','MILESTONE_BASED']) contractType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() payRangeSol?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) budgetSol?: number;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() skills?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() chains?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() requirements?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() duration?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() posterEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() submissionDestination?: string;
}

export class UpdateJobDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['OPEN','IN_PROGRESS','COMPLETED','CLOSED']) status?: string;
}

export class ApplyJobDto {
  @ApiProperty() @IsString() coverLetter: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) proposedRateSol?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioUrl?: string;
}

export class UpdateApplicationDto {
  @ApiProperty() @IsEnum(['applied','viewed','shortlisted','hired','rejected','paid']) status: string;
}
