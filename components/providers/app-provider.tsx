import NextTopLoader from 'nextjs-toploader';
import { NextIntlClientProvider } from 'next-intl';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/providers/theme-provider';

interface AppProviderProps {
  children: React.ReactNode;
  locale: string;
}

export default function AppProvider({ locale, children }: AppProviderProps) {
  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <NextTopLoader color='var(--primary)' showSpinner={false} />
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
