import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingContact from '@/components/shared/floating-contact';
import { getContactSettings } from '@/lib/db';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const contactSettings = await getContactSettings();

  return (
    <>
      <Header hotline={contactSettings.hotline} />
      <main className='flex-1'>{children}</main>
      <Footer />
      <FloatingContact
        hotline={contactSettings.hotline}
        zaloId={contactSettings.zaloId}
        messengerId={contactSettings.messengerId}
      />
    </>
  );
}
