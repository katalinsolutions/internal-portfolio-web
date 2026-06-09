'use client';

import { useTranslations } from 'next-intl';
import { RiMacbookLine, RiArticleLine, RiShieldFlashLine, RiFundsLine } from '@remixicon/react';

import Container from '@/components/shared/container';

export default function ServicesMobile() {
  const t = useTranslations('services');

  const servicesList = [
    {
      key: 'web',
      icon: RiMacbookLine,
      colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      key: 'content',
      icon: RiArticleLine,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      key: 'brand',
      icon: RiShieldFlashLine,
      colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      key: 'ads',
      icon: RiFundsLine,
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <section className='py-16 border-t bg-background relative overflow-hidden'>
      <Container className='space-y-10 px-4'>
        {/* Section Header */}
        <div className='text-center space-y-2.5 max-w-sm mx-auto'>
          <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>{t('title')}</h2>
          <p className='text-sm text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {/* Services List - Mobile Vertical Stack */}
        <div className='space-y-4'>
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className='flex items-start gap-4 p-5 rounded-2xl border bg-card/50 backdrop-blur-xs shadow-sm active:scale-[0.99] transition-transform duration-200'
              >
                {/* Icon Wrapper */}
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${service.colorClass}`}
                >
                  <Icon className='w-5.5 h-5.5' />
                </div>

                {/* Text Content */}
                <div className='space-y-1 flex-1'>
                  <h3 className='text-base font-bold text-foreground'>
                    {t(`${service.key}.title`)}
                  </h3>
                  <p className='text-xs text-muted-foreground leading-relaxed'>
                    {t(`${service.key}.desc`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
