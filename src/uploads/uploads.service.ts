import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadsService {
  private supabase;

  constructor(private cfg: ConfigService) {
    this.supabase = createClient(
      cfg.getOrThrow<string>('SUPABASE_URL'),
      cfg.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  /**
   * Generate a signed upload URL for Supabase Storage.
   * The client uploads directly to this URL; after upload,
   * they save the resulting public URL to their profile via the Users API.
   */
  async getSignedUploadUrl(
    bucket: 'avatars' | 'documents' | 'portfolio',
    fileName: string,
    userId: string,
  ): Promise<{ uploadUrl: string; path: string; publicUrl: string }> {
    const path = `${userId}/${Date.now()}-${fileName}`;
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) throw error;

    const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(path);

    return {
      uploadUrl: data.signedUrl,
      path,
      publicUrl: urlData.publicUrl,
    };
  }
}
