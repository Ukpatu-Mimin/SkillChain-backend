import { UploadsService } from './uploads.service';
import { Profile } from '@prisma/client';
export declare class UploadsController {
    private uploads;
    constructor(uploads: UploadsService);
    presign(user: Profile, dto: {
        bucket: 'avatars' | 'documents' | 'portfolio';
        fileName: string;
    }): Promise<{
        uploadUrl: string;
        path: string;
        publicUrl: string;
    }>;
}
