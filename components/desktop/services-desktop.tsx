'use client';

import { useTranslations } from 'next-intl';
import { RiMacbookLine, RiArticleLine, RiShieldFlashLine, RiFundsLine } from '@remixicon/react';

import Container from '@/components/shared/container';

export default function ServicesDesktop() {
  const t = useTranslations('services');

  const servicesList = [
    {
      key: 'web',
      icon: RiMacbookLine,
      colorClass:
        'text-blue-500 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white',
      glowClass: 'group-hover:shadow-blue-500/10',
    },
    {
      key: 'content',
      icon: RiArticleLine,
      colorClass:
        'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white',
      glowClass: 'group-hover:shadow-emerald-500/10',
    },
    {
      key: 'brand',
      icon: RiShieldFlashLine,
      colorClass:
        'text-purple-500 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white',
      glowClass: 'group-hover:shadow-purple-500/10',
    },
    {
      key: 'ads',
      icon: RiFundsLine,
      colorClass:
        'text-rose-500 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white',
      glowClass: 'group-hover:shadow-rose-500/10',
    },
  ];

  return (
    <section
      id='services-section'
      className='py-24 border-t bg-background relative overflow-hidden'
    >
      {/* Visual background details */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none' />

      <Container className='relative z-10 space-y-16'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto space-y-4'>
          <h2 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
            {t('title')}
          </h2>
          <p className='text-lg text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl border bg-card/40 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:border-primary/20 hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between h-[320px] ${service.glowClass}`}
              >
                {/* Gradient Border Glow */}
                <div className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-300 pointer-events-none' />

                <div className='space-y-6'>
                  {/* Icon Wrapper */}
                  <div
                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${service.colorClass}`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-xl font-bold text-foreground group-hover:text-primary transition-colors'>
                      {t(`${service.key}.title`)}
                    </h3>
                    <p className='text-sm text-muted-foreground line-clamp-4 leading-relaxed'>
                      {t(`${service.key}.desc`)}
                    </p>
                  </div>
                </div>

                {/* Corner detail decoration */}
                <div className='flex justify-end pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <span className='text-xs font-semibold text-primary flex items-center gap-1'>
                    Katalin Solution
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
