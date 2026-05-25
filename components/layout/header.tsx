'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';
import ThemeToggle from '@/components/shared/theme-toggle';
import LanguageSwitcher from '@/components/shared/language-switcher';

import { logoDark, logoLight } from '@/assets/images';
import { Link } from '@/i18n/navigation';

export default function Header() {
  const t = useTranslations('auth');

  return (
    <header className='border-b h-15 flex justify-center items-center sticky top-0'>
      <Container>
        <nav className='flex items-center justify-between'>
          <Link href={'/'}>
            <Image
              src={logoDark}
              height={38}
              width={140}
              alt='Logo'
              priority
              className='hidden dark:block'
            />
            <Image
              src={logoLight}
              height={38}
              width={140}
              alt='Logo'
              priority
              className='dark:hidden'
            />
          </Link>
          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <LanguageSwitcher />
            <Button className='px-4'>{t('login')}</Button>
          </div>
        </nav>
      </Container>
    </header>
  );
}
