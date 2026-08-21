import { IsString, IsOptional, IsArray, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['general', 'job_announcement', 'portfolio_showcase']) type?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() hashtags?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() mediaUrls?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() jobSkills?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) budgetSol?: number;
}

export class UpdatePostDto {
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() hashtags?: string[];
}
