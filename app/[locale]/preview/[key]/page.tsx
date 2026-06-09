import { notFound } from 'next/navigation';
import PreviewClient from './preview-client';
import { getTemplates } from '@/lib/db';

// Dynamic route — không dùng generateStaticParams cố định nữa
// Mọi key hợp lệ trong DB đều được chấp nhận
export const dynamic = 'force-dynamic';

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}) {
  const { key } = await params;

  // Kiểm tra key có tồn tại trong database không
  const templates = await getTemplates();
  const exists = templates.some((t) => t.key === key);

  if (!exists) {
    notFound();
  }

  return <PreviewClient projectKey={key} />;
}
