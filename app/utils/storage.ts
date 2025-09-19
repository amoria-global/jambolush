// app/utils/storage.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL! || "https://ftihjzudufdjjabnpaqv.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY! || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0aWhqenVkdWZkamphYm5wYXF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg4NzE1NCwiZXhwIjoyMDcxNDYzMTU0fQ.r2SJhcjDU1T2jYa1reRM0k3SG5utu3p6oxp2O1KrjfE"
);

// export const supabase = createClient(supabaseUrl, supabaseKey);

export class DocumentUploadService {
  private static instance: DocumentUploadService;

  public static getInstance(): DocumentUploadService {
    if (!DocumentUploadService.instance) {
      DocumentUploadService.instance = new DocumentUploadService();
    }
    return DocumentUploadService.instance;
  }

  /**
   * Upload verification document to Supabase storage
   */
  async uploadVerificationDocument(
    file: File, 
    userId: string, 
    documentType: 'national_id' | 'company_tin' | 'employment_contract'
  ): Promise<string> {
    try {
      // Validate file first
      const validation = this.validateDocument(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userId}_${documentType}_${timestamp}.${fileExtension}`;
      const filePath = `verification-documents/${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;

    } catch (error: any) {
      console.error('Document upload error:', error);
      throw new Error(error.message || 'Failed to upload document');
    }
  }

  /**
   * Validate document file before upload
   */
  validateDocument(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!file) {
      return { valid: false, error: 'Please select a file' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File must be JPEG, PNG, or PDF' };
    }

    return { valid: true };
  }

  /**
   * Delete verification document from Supabase storage
   */
  async deleteVerificationDocument(documentUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const url = new URL(documentUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('verification-documents')).join('/');

      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Document deletion error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const documentUploadService = DocumentUploadService.getInstance();