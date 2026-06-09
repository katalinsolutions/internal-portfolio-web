'use client';

import { useTranslations } from 'next-intl';
import { RiSparklingLine, RiPhoneLine, RiCalendarLine } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';

export default function HeroMobile() {
  const t = useTranslations('hero');

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className='relative min-h-[calc(100vh-60px)] flex items-center py-12 bg-background overflow-hidden'>
      {/* Background soft glowing blur */}
      <div className='absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none' />

      <Container className='relative z-10 flex flex-col items-center text-center space-y-6 px-4'>
        {/* Badge */}
        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-2xs font-semibold uppercase tracking-wider'>
          <RiSparklingLine className='w-3.5 h-3.5' />
          {t('badge')}
        </div>

        {/* Title */}
        <h1 className='text-3xl sm:text-4xl font-black tracking-tight leading-[1.2] text-foreground'>
          {t('title')
            .split(' & ')
            .map((part, index) => (
              <span key={index}>
                {index > 0 && (
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500'>
                    {' '}
                    &{' '}
                  </span>
                )}
                {part}
              </span>
            ))}
        </h1>

        {/* Description */}
        <p className='text-sm text-muted-foreground leading-relaxed max-w-sm'>{t('subtitle')}</p>

        {/* Action Buttons */}
        <div className='flex flex-col gap-3 w-full max-w-xs pt-4'>
          <Button
            onClick={scrollToContact}
            className='w-full py-5 rounded-2xl text-sm font-bold bg-primary text-primary-foreground shadow-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-all'
          >
            <RiCalendarLine className='w-4.5 h-4.5' />
            {t('cta')}
          </Button>

          {/* Quick Call Zalo / Hotline */}
          <Button
            variant='outline'
            asChild
            className='w-full py-5 rounded-2xl text-sm font-bold border-border bg-card active:scale-[0.97] transition-all flex items-center justify-center gap-2'
          >
            <a href='tel:0900000000'>
              <RiPhoneLine className='w-4.5 h-4.5 text-primary animate-pulse' />
              Hotline: 090 000 0000
            </a>
          </Button>
        </div>

        {/* Mobile Mock Element */}
        <div className='w-full max-w-[280px] aspect-[16/10] rounded-2xl border border-border bg-card/60 p-4 shadow-xl flex flex-col justify-between mt-8'>
          <div className='flex justify-between items-center text-3xs font-mono text-muted-foreground border-b pb-2'>
            <span>MOBILE PERFORMANCE</span>
            <span className='text-emerald-500 font-bold'>99%</span>
          </div>
          <div className='space-y-1.5 py-4'>
            <div className='h-1.5 w-1/2 bg-muted rounded-full' />
            <div className='h-3 w-4/5 bg-foreground rounded-full' />
          </div>
          <div className='w-full h-1 bg-muted rounded-full overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full'
              style={{ width: '92%' }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
