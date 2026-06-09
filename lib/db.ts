import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export interface TemplateData {
  key: string;
  category: string;
  demoPath: string;
  thumbnailUrl: string | null;
  titleVi: string | null;
  titleEn: string | null;
  descVi: string | null;
  descEn: string | null;
}

const JSON_FILE_PATH = path.join(process.cwd(), 'data', 'templates.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseEnabled = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseEnabled ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

// Helpers for Local JSON Database
function readLocalTemplates(): TemplateData[] {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local templates:', error);
    return [];
  }
}

function writeLocalTemplates(templates: TemplateData[]) {
  try {
    const dir = path.dirname(JSON_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(templates, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local templates:', error);
  }
}

// Helper to delete local file
function deleteLocalFile(relativeUrl: string) {
  try {
    if (relativeUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', relativeUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted local thumbnail: ${filePath}`);
      }
    }
  } catch (err) {
    console.error('Failed to delete local file:', err);
  }
}

// Helper to delete Supabase storage file
async function deleteSupabaseFile(publicUrl: string) {
  if (!isSupabaseEnabled || !supabase) return;
  try {
    const fileName = publicUrl.split('/').pop();
    if (fileName) {
      const { error } = await supabase.storage.from('thumbnails').remove([fileName]);
      if (error) throw error;
      console.log(`Deleted Supabase storage file: ${fileName}`);
    }
  } catch (err) {
    console.error('Failed to delete Supabase storage file:', err);
  }
}

// ----------------------------------------------------------------
// PUBLIC INTERFACES
// ----------------------------------------------------------------

export async function getTemplates(): Promise<TemplateData[]> {
  if (isSupabaseEnabled && supabase) {
    try {
      console.log('[db] Fetching templates from Supabase...');
      const { data, error } = await supabase
        .from('templates')
        .select(
          'key, category, demoPath:demo_path, thumbnailUrl:thumbnail_url, titleVi:title_vi, titleEn:title_en, descVi:desc_vi, descEn:desc_en',
        )
        .order('key', { ascending: true });

      if (error) throw error;
      // Return data even if empty array — table exists but has no rows yet
      console.log(`[db] Supabase returned ${data?.length ?? 0} templates`);
      return (data ?? []) as TemplateData[];
    } catch (err) {
      console.error('[db] Supabase getTemplates failed, falling back to local:', err);
    }
  } else {
    console.log('[db] Supabase not configured, using local JSON fallback');
  }

  // Fallback to local file-based database
  return readLocalTemplates();
}

export async function createTemplate(data: TemplateData): Promise<boolean> {
  if (isSupabaseEnabled && supabase) {
    try {
      const { error } = await supabase.from('templates').insert([
        {
          key: data.key,
          category: data.category,
          demo_path: data.demoPath,
          thumbnail_url: data.thumbnailUrl,
          title_vi: data.titleVi,
          title_en: data.titleEn,
          desc_vi: data.descVi,
          desc_en: data.descEn,
        },
      ]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase createTemplate failed, falling back to local:', err);
    }
  }

  // Local write
  const templates = readLocalTemplates();
  const exists = templates.some((t) => t.key === data.key);
  if (exists) {
    return false; // key must be unique
  }
  templates.push(data);
  writeLocalTemplates(templates);
  return true;
}

export async function updateTemplate(
  key: string,
  updatedData: {
    category?: string;
    demoPath: string;
    thumbnailUrl?: string | null;
    titleVi?: string | null;
    titleEn?: string | null;
    descVi?: string | null;
    descEn?: string | null;
  },
): Promise<boolean> {
  if (isSupabaseEnabled && supabase) {
    try {
      const updatePayload: Record<string, string | null> = {
        demo_path: updatedData.demoPath,
      };
      if (updatedData.category !== undefined) {
        updatePayload.category = updatedData.category;
      }
      if (updatedData.thumbnailUrl !== undefined) {
        updatePayload.thumbnail_url = updatedData.thumbnailUrl;
      }
      if (updatedData.titleVi !== undefined) {
        updatePayload.title_vi = updatedData.titleVi;
      }
      if (updatedData.titleEn !== undefined) {
        updatePayload.title_en = updatedData.titleEn;
      }
      if (updatedData.descVi !== undefined) {
        updatePayload.desc_vi = updatedData.descVi;
      }
      if (updatedData.descEn !== undefined) {
        updatePayload.desc_en = updatedData.descEn;
      }

      const { error } = await supabase.from('templates').update(updatePayload).eq('key', key);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase updateTemplate failed, falling back to local:', err);
    }
  }

  // Local write
  const templates = readLocalTemplates();
  const index = templates.findIndex((t) => t.key === key);
  if (index !== -1) {
    const current = templates[index];
    current.demoPath = updatedData.demoPath;

    if (updatedData.category !== undefined) {
      current.category = updatedData.category;
    }

    // Delete old local file if new thumbnail is provided or cleared
    if (
      updatedData.thumbnailUrl !== undefined &&
      current.thumbnailUrl !== updatedData.thumbnailUrl
    ) {
      if (current.thumbnailUrl) {
        deleteLocalFile(current.thumbnailUrl);
      }
      current.thumbnailUrl = updatedData.thumbnailUrl;
    }

    if (updatedData.titleVi !== undefined) current.titleVi = updatedData.titleVi;
    if (updatedData.titleEn !== undefined) current.titleEn = updatedData.titleEn;
    if (updatedData.descVi !== undefined) current.descVi = updatedData.descVi;
    if (updatedData.descEn !== undefined) current.descEn = updatedData.descEn;

    writeLocalTemplates(templates);
    return true;
  }
  return false;
}

export async function deleteTemplate(key: string): Promise<boolean> {
  // Read current to check if there is an image to delete
  let existingThumbnail: string | null = null;
  const templates = readLocalTemplates();
  const index = templates.findIndex((t) => t.key === key);
  if (index !== -1) {
    existingThumbnail = templates[index].thumbnailUrl;
  }

  if (isSupabaseEnabled && supabase) {
    try {
      // First select the template to get the thumbnail URL in case local file-state differs
      const { data } = await supabase
        .from('templates')
        .select('thumbnail_url')
        .eq('key', key)
        .single();
      if (data?.thumbnail_url) {
        existingThumbnail = data.thumbnail_url;
      }

      const { error } = await supabase.from('templates').delete().eq('key', key);
      if (error) throw error;

      // Clean up storage
      if (existingThumbnail) {
        await deleteSupabaseFile(existingThumbnail);
      }
      return true;
    } catch (err) {
      console.error('Supabase deleteTemplate failed, falling back to local:', err);
    }
  }

  // Local delete
  if (index !== -1) {
    // Delete file
    if (existingThumbnail) {
      deleteLocalFile(existingThumbnail);
    }
    templates.splice(index, 1);
    writeLocalTemplates(templates);
    return true;
  }
  return false;
}

export async function uploadThumbnail(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  if (isSupabaseEnabled && supabase) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload file to 'thumbnails' bucket
      const { error } = await supabase.storage.from('thumbnails').upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Supabase uploadThumbnail failed, falling back to local:', err);
    }
  }

  // Local upload fallback
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Return the relative public path
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Local upload failed:', error);
    return null;
  }
}
