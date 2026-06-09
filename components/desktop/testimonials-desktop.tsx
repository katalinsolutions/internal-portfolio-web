'use client';

import { useTranslations } from 'next-intl';
import { RiDoubleQuotesL } from '@remixicon/react';

import Container from '@/components/shared/container';

export default function TestimonialsDesktop() {
  const t = useTranslations('testimonials');

  const testimonialKeys = ['user1', 'user2'];

  return (
    <section
      id='testimonials-section'
      className='py-24 border-t bg-background/50 relative overflow-hidden'
    >
      {/* Visual glowing layout */}
      <div className='absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none' />

      <Container className='relative z-10 space-y-16'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto space-y-4'>
          <h2 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
            {t('title')}
          </h2>
          <p className='text-lg text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {/* Testimonials List */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
          {testimonialKeys.map((key) => (
            <div
              key={key}
              className='relative p-8 rounded-3xl border bg-card/60 backdrop-blur-md shadow-lg hover:shadow-2xl hover:border-primary/20 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between space-y-6 group'
            >
              {/* Quote Icon */}
              <RiDoubleQuotesL className='w-10 h-10 text-primary/20 absolute top-6 left-6 pointer-events-none' />

              <p className='text-base text-foreground/80 leading-relaxed italic relative z-10 pt-4'>
                &ldquo;{t(`list.${key}.comment`)}&rdquo;
              </p>

              {/* User details */}
              <div className='flex items-center gap-4 pt-4 border-t'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-extrabold shadow-md'>
                  {t(`list.${key}.name`).charAt(0)}
                </div>
                <div>
                  <h4 className='text-sm font-bold text-foreground'>{t(`list.${key}.name`)}</h4>
                  <p className='text-xs text-muted-foreground'>{t(`list.${key}.role`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
