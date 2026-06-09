-- ============================================================
-- KATALIN ADMIN — Supabase Setup Script
-- Chạy toàn bộ script này trong Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tạo bảng templates (nếu chưa có)
CREATE TABLE IF NOT EXISTS public.templates (
  key          TEXT PRIMARY KEY,
  category     TEXT NOT NULL DEFAULT 'sales',
  demo_path    TEXT NOT NULL,
  thumbnail_url TEXT,
  title_vi     TEXT,
  title_en     TEXT,
  desc_vi      TEXT,
  desc_en      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bật RLS (Row Level Security)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 3. Xoá policy cũ nếu có (tránh conflict)
DROP POLICY IF EXISTS "Allow public read" ON public.templates;
DROP POLICY IF EXISTS "Allow anon insert" ON public.templates;
DROP POLICY IF EXISTS "Allow anon update" ON public.templates;
DROP POLICY IF EXISTS "Allow anon delete" ON public.templates;

-- 4. Tạo policies cho phép anon key đọc/ghi toàn bộ
--    (Vì admin dashboard dùng anon key + cookie session để bảo mật)
CREATE POLICY "Allow public read"
  ON public.templates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon insert"
  ON public.templates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon update"
  ON public.templates FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete"
  ON public.templates FOR DELETE
  TO anon, authenticated
  USING (true);

-- 5. Tạo Storage bucket "thumbnails" (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies cho bucket thumbnails
DROP POLICY IF EXISTS "Allow public read thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete thumbnails" ON storage.objects;

CREATE POLICY "Allow public read thumbnails"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Allow anon upload thumbnails"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Allow anon delete thumbnails"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'thumbnails');

-- 7. Tạo bảng settings cho cấu hình chung (Zalo, Messenger, Hotline, v.v...)
CREATE TABLE IF NOT EXISTS public.settings (
  key          TEXT PRIMARY KEY,
  value        JSONB NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Bật RLS cho bảng settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Xoá policy cũ nếu có
DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow anon insert/upsert settings" ON public.settings;
DROP POLICY IF EXISTS "Allow anon update settings" ON public.settings;

-- Tạo policies cho bảng settings
CREATE POLICY "Allow public read settings"
  ON public.settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon insert/upsert settings"
  ON public.settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon update settings"
  ON public.settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 8. Tạo bảng contacts để lưu trữ thông tin liên hệ từ khách hàng
CREATE TABLE IF NOT EXISTS public.contacts (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  message      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Bật RLS cho bảng contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Xoá policy cũ nếu có
DROP POLICY IF EXISTS "Allow public insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow admin select contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow admin delete contacts" ON public.contacts;

-- Tạo policies cho bảng contacts
-- Khách truy cập được phép gửi thông tin liên hệ (INSERT)
CREATE POLICY "Allow public insert contacts"
  ON public.contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin được xem danh sách liên hệ (SELECT)
CREATE POLICY "Allow admin select contacts"
  ON public.contacts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin được xoá danh sách liên hệ (DELETE)
CREATE POLICY "Allow admin delete contacts"
  ON public.contacts FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================================
-- XONG! Sau khi chạy xong, quay lại trang Admin là có thể dùng.
-- ============================================================
