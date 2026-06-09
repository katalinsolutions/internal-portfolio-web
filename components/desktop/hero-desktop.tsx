'use client';

import { useTranslations } from 'next-intl';
import {
  RiArrowRightLine,
  RiSparklingLine,
  RiCustomerService2Line,
  RiCodeSSlashLine,
} from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';

export default function HeroDesktop() {
  const t = useTranslations('hero');

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className='relative min-h-[calc(100vh-60px)] flex items-center overflow-hidden py-20 bg-background'>
      {/* Background glowing gradients */}
      <div className='absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none' />
      <div className='absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none' />

      <Container className='relative z-10 grid grid-cols-12 gap-8 items-center'>
        {/* Left Content */}
        <div className='col-span-7 space-y-6 text-left animate-fade-in'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-sm'>
            <RiSparklingLine className='w-4 h-4' />
            {t('badge')}
          </div>

          <h1 className='text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground'>
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

          <p className='text-lg text-muted-foreground max-w-2xl leading-relaxed'>{t('subtitle')}</p>

          <div className='flex items-center gap-4 pt-4'>
            <Button
              onClick={scrollToContact}
              className='px-8 py-6 rounded-full text-base font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 group'
            >
              {t('cta')}
              <RiArrowRightLine className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Button>

            <Button
              variant='outline'
              onClick={scrollToServices}
              className='px-8 py-6 rounded-full text-base font-semibold border-border hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300'
            >
              {t('secondary')}
            </Button>
          </div>
        </div>

        {/* Right Graphic / Dashboard Preview */}
        <div className='col-span-5 relative animate-fade-in delay-150'>
          <div className='relative mx-auto w-full max-w-[420px] aspect-[4/5] rounded-3xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl p-6 overflow-hidden flex flex-col justify-between group hover:border-primary/20 transition-all duration-500'>
            {/* Header Mock */}
            <div className='flex items-center justify-between border-b pb-4'>
              <div className='flex gap-1.5'>
                <span className='w-3 h-3 rounded-full bg-red-500/80' />
                <span className='w-3 h-3 rounded-full bg-yellow-500/80' />
                <span className='w-3 h-3 rounded-full bg-green-500/80' />
              </div>
              <span className='text-2xs text-muted-foreground font-mono'>katalin.solutions</span>
            </div>

            {/* Dashboard Mock Content */}
            <div className='flex-1 py-6 flex flex-col justify-center space-y-6'>
              <div className='space-y-2'>
                <div className='h-2 w-1/3 bg-muted rounded-full' />
                <div className='h-4 w-3/4 bg-foreground rounded-full font-bold' />
              </div>

              {/* Decorative charts / blocks */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-between space-y-4'>
                  <RiCodeSSlashLine className='w-8 h-8 text-primary' />
                  <div>
                    <div className='text-xs text-muted-foreground'>Clean Code</div>
                    <div className='text-lg font-bold text-foreground'>99.9%</div>
                  </div>
                </div>

                <div className='p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-between space-y-4'>
                  <RiCustomerService2Line className='w-8 h-8 text-indigo-500' />
                  <div>
                    <div className='text-xs text-muted-foreground'>Live Conversion</div>
                    <div className='text-lg font-bold text-foreground'>+320%</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Mock */}
              <div className='p-4 rounded-2xl border bg-background/50 space-y-2'>
                <div className='flex justify-between text-xs font-mono'>
                  <span>SEO Ranking</span>
                  <span className='text-primary font-bold'>#1 Google</span>
                </div>
                <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full w-full bg-gradient-to-r from-primary to-indigo-500 rounded-full animate-pulse'
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Mock */}
            <div className='text-center text-3xs font-mono text-muted-foreground border-t pt-4'>
              SYSTEM STATUS: ACTIVE
            </div>
          </div>

          {/* Floating glowing accents */}
          <div className='absolute -top-4 -left-4 w-12 h-12 rounded-full bg-indigo-500/20 blur-xl animate-bounce' />
          <div className='absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-primary/20 blur-xl animate-pulse' />
        </div>
      </Container>
    </section>
  );
}
