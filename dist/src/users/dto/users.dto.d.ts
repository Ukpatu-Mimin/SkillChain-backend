import { UserRole, PreferredCurrency } from '@prisma/client';
export declare class UpdateProfileDto {
    name?: string;
    title?: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    walletAddress?: string;
    hourlyRateSol?: number;
    preferredCurrency?: PreferredCurrency;
    role?: UserRole;
    location?: string;
    skills?: string[];
    chains?: string[];
    jobTypes?: string[];
    githubUrl?: string;
    twitterUrl?: string;
}
export declare class OnboardProfileDto {
    name?: string;
    title?: string;
    bio?: string;
    role?: UserRole;
    skills?: string[];
    chains?: string[];
    walletAddress?: string;
}
export declare class CreateDocumentDto {
    type: string;
    title: string;
    fileName: string;
    fileSize?: string;
    fileUrl?: string;
    description?: string;
}
export declare class UpdateDocumentDto {
    title?: string;
    fileUrl?: string;
    description?: string;
    isDefault?: boolean;
}
