'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  updateTemplate,
  uploadThumbnail,
  getTemplates,
  createTemplate,
  deleteTemplate,
  TemplateData,
  getContactSettings,
  updateContactSettings,
  ContactSettings,
  createContactLead,
  getContactLeads,
  deleteContactLead,
  ContactLead,
} from '@/lib/db';

const SESSION_COOKIE_NAME = 'katalin_admin_session';
const DEFAULT_PASSWORD = 'admin123';

/**
 * Log in the admin by setting a secure cookie.
 */
export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: 'authenticated_session_token_xyz',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Mật khẩu không chính xác' };
}

/**
 * Log out the admin by clearing the session cookie.
 */
export async function logoutAdmin(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

/**
 * Check if the admin is authenticated (server-side helper).
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === 'authenticated_session_token_xyz';
}

/**
 * Save template modifications and revalidate routes.
 */
export async function saveTemplateAction(
  key: string,
  demoPath: string,
  thumbnailUrl?: string | null,
  titleVi?: string | null,
  titleEn?: string | null,
  descVi?: string | null,
  descEn?: string | null,
  category?: string,
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn' };
  }

  try {
    const success = await updateTemplate(key, {
      demoPath,
      thumbnailUrl,
      titleVi,
      titleEn,
      descVi,
      descEn,
      category,
    });
    if (success) {
      revalidatePath('/', 'layout');
      return { success: true };
    }
    return { success: false, error: 'Không tìm thấy mẫu giao diện cần cập nhật' };
  } catch (err) {
    console.error('saveTemplateAction error:', err);
    return { success: false, error: 'Lỗi máy chủ khi cập nhật dữ liệu' };
  }
}

/**
 * Create a new website template.
 */
export async function createTemplateAction(
  data: TemplateData,
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn' };
  }

  // Basic validation
  if (!data.key || !data.category || !data.demoPath) {
    return { success: false, error: 'Vui lòng nhập đầy đủ Key, Danh mục và Link demo' };
  }

  // Validate key format (alphanumeric and hyphens only)
  if (!/^[a-zA-Z0-9_-]+$/.test(data.key)) {
    return { success: false, error: 'Mã Key chỉ được chứa chữ cái, số, gạch ngang và gạch dưới' };
  }

  try {
    const success = await createTemplate(data);
    if (success) {
      revalidatePath('/', 'layout');
      return { success: true };
    }
    return { success: false, error: 'Mã Key này đã tồn tại trong hệ thống' };
  } catch (err) {
    console.error('createTemplateAction error:', err);
    return { success: false, error: 'Lỗi máy chủ khi thêm mẫu mới' };
  }
}

/**
 * Delete a website template.
 */
export async function deleteTemplateAction(
  key: string,
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn' };
  }

  try {
    const success = await deleteTemplate(key);
    if (success) {
      revalidatePath('/', 'layout');
      return { success: true };
    }
    return { success: false, error: 'Không tìm thấy mẫu cần xóa hoặc xóa thất bại' };
  } catch (err) {
    console.error('deleteTemplateAction error:', err);
    return { success: false, error: 'Lỗi máy chủ khi xóa mẫu giao diện' };
  }
}

/**
 * Upload thumbnail image.
 */
export async function uploadThumbnailAction(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn' };
  }

  const file = formData.get('thumbnail') as File | null;
  if (!file) {
    return { success: false, error: 'Không tìm thấy tệp tải lên' };
  }

  // Basic validation
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Tệp tải lên phải là hình ảnh' };
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    return { success: false, error: 'Kích thước tệp không được vượt quá 5MB' };
  }

  try {
    const url = await uploadThumbnail(file);
    if (url) {
      return { success: true, url };
    }
    return { success: false, error: 'Tải ảnh lên thất bại' };
  } catch (err) {
    console.error('uploadThumbnailAction error:', err);
    return { success: false, error: 'Lỗi máy chủ khi tải ảnh lên' };
  }
}

/**
 * Server action to get all templates (accessible by client components).
 */
export async function getTemplatesAction() {
  return getTemplates();
}

/**
 * Server action to get contact settings.
 */
export async function getContactSettingsAction(): Promise<ContactSettings> {
  return getContactSettings();
}

/**
 * Server action to save contact settings (authenticated).
 */
export async function saveContactSettingsAction(
  settings: ContactSettings,
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn' };
  }

  try {
    const success = await updateContactSettings(settings);
    if (success) {
      revalidatePath('/', 'layout');
      return { success: true };
    }
    return { success: false, error: 'Cập nhật cấu hình thất bại' };
  } catch (err) {
    console.error('saveContactSettingsAction error:', err);
    return { success: false, error: 'Lỗi máy chủ khi lưu cấu hình' };
  }
}

/**
 * Public action to submit a new contact request.
 */
export async function submitContactAction(
  lead: Omit<ContactLead, 'id' | 'createdAt'>,
): Promise<{ success: boolean; error?: string }> {
  // Basic validation
  if (!lead.name || !lead.email || !lead.phone) {
    return { success: false, error: 'Vui lòng cung cấp tên, email và số điện thoại' };
  }
  try {
    const success = await createContactLead(lead);
    if (success) {
      // Revalidate dashboard page
      revalidatePath('/admin/dashboard', 'page');
      return { success: true };
    }
    return { success: false, error: 'Gửi thông tin thất bại' };
  } catch (err) {
    console.error('submitContactAction error:', err);
    return { success: false, error: 'Lỗi hệ thống khi gửi thông tin' };
  }
}

/**
 * Authenticated action to get contact leads list.
 */
export async function getContactLeadsAction(): Promise<ContactLead[]> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    throw new Error('Chưa đăng nhập hoặc phiên làm việc hết hạn');
  }
  return getContactLeads();
}

/**
 * Authenticated action to delete a contact lead.
 */
export async function deleteContactLeadAction(
  id: string | number,
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn' };
  }
  try {
    const success = await deleteContactLead(id);
    if (success) {
      revalidatePath('/admin/dashboard', 'page');
      return { success: true };
    }
    return { success: false, error: 'Xóa yêu cầu thất bại' };
  } catch (err) {
    console.error('deleteContactLeadAction error:', err);
    return { success: false, error: 'Lỗi hệ thống khi xóa yêu cầu' };
  }
}
