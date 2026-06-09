export const CONTACT_CONFIG = {
  /** Số điện thoại Hotline nhận cuộc gọi (viết liền không dấu cách, ví dụ: 0900000000) */
  hotline: process.env.NEXT_PUBLIC_HOTLINE || '0900000000',

  /** Số điện thoại đăng ký Zalo hoặc mã QR ID Zalo để chat (ví dụ: 0900000000) */
  zaloId: process.env.NEXT_PUBLIC_ZALO_ID || '0900000000',

  /** Tên định danh (username) của trang Facebook Messenger (ví dụ: katalinsolutions) */
  messengerId: process.env.NEXT_PUBLIC_MESSENGER_ID || 'katalinsolutions',
};
