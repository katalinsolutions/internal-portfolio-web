'use client';

import { useTheme } from 'next-themes';
import { RiMoonLine, RiSunLine } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import AppTooltip from '@/components/shared/app-tooltip';
import { useTranslations } from 'next-intl';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  const t = useTranslations('common');

  return (
    <AppTooltip content={t('theme')}>
      <Button variant='outline' size='icon' onClick={toggleTheme}>
        <RiSunLine className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
        <RiMoonLine className='size-4 absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      </Button>
    </AppTooltip>
  );
}
