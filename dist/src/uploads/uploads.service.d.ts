import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private cfg;
    private supabase;
    constructor(cfg: ConfigService);
    getSignedUploadUrl(bucket: 'avatars' | 'documents' | 'portfolio', fileName: string, userId: string): Promise<{
        uploadUrl: string;
        path: string;
        publicUrl: string;
    }>;
}
