'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useTranslations } from 'use-intl';

import { flagEN, flagVN } from '@/assets/images';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AppTooltip from '@/components/shared/app-tooltip';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const handleChangeLanguage = (nextLocale: string) => {
    router.replace({ pathname }, { locale: nextLocale });
  };

  const languageMaps: Record<string, string> = {
    vi: t('language.vi'),
    en: t('language.en'),
  };

  const getIconFlag = (lang: string) => {
    switch (lang) {
      case 'en':
        return <Image src={flagEN} alt='Flag EN' className='h-auto w-5' />;
      default:
        return <Image src={flagVN} alt='Flag VN' className='h-auto w-5' />;
    }
  };

  return (
    <Select onValueChange={handleChangeLanguage} value={locale}>
      <AppTooltip content={t('language.title')}>
        <SelectTrigger className='min-w-32'>
          <SelectValue>
            {getIconFlag(locale)}
            {languageMaps[locale]}
          </SelectValue>
        </SelectTrigger>
      </AppTooltip>
      <SelectContent position='popper' side='bottom' align='end'>
        <SelectGroup>
          {['vi', 'en'].map((lang) => {
            return (
              <SelectItem key={lang} value={lang}>
                {getIconFlag(lang)}
                {languageMaps[lang]}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
