import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, PreferredCurrency } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(80) name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) bio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() avatar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() walletAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) hourlyRateSol?: number;
  @ApiPropertyOptional({ enum: PreferredCurrency }) @IsOptional() @IsEnum(PreferredCurrency) preferredCurrency?: PreferredCurrency;
  @ApiPropertyOptional({ enum: UserRole }) @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) chains?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) jobTypes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsUrl() githubUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() twitterUrl?: string;
}

export class OnboardProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(80) name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) bio?: string;
  @ApiPropertyOptional({ enum: UserRole }) @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) chains?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() walletAddress?: string;
}

export class CreateDocumentDto {
  @IsString() type: string;
  @IsString() title: string;
  @IsString() fileName: string;
  @IsOptional() @IsString() fileSize?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateDocumentDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() isDefault?: boolean;
}
