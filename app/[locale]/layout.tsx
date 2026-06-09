import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import AppProvider from '@/components/providers/app-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Katalin Solutions | Thiết Kế Website & Digital Marketing Trọn Gói',
  description:
    'Katalin Solutions cung cấp giải pháp số toàn diện cho doanh nghiệp: Thiết kế & lập trình Website chuyên nghiệp, xây dựng nội dung (Content), quản trị thương hiệu và chạy quảng cáo (Ads) tối ưu chuyển đổi.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className='h-full antialiased font-sans' suppressHydrationWarning>
      <body className='min-h-full flex flex-col'>
        <AppProvider locale={locale}>{children}</AppProvider>
      </body>
    </html>
  );
}
