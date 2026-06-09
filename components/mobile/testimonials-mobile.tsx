'use client';

import { useTranslations } from 'next-intl';
import { RiDoubleQuotesL } from '@remixicon/react';

import Container from '@/components/shared/container';

export default function TestimonialsMobile() {
  const t = useTranslations('testimonials');

  const testimonialKeys = ['user1', 'user2'];

  return (
    <section className='py-16 border-t bg-background/50 relative overflow-hidden'>
      <Container className='space-y-10 px-4'>
        {/* Section Header */}
        <div className='text-center space-y-2.5 max-w-sm mx-auto'>
          <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>{t('title')}</h2>
          <p className='text-sm text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {/* Testimonials List */}
        <div className='space-y-6 max-w-sm mx-auto'>
          {testimonialKeys.map((key) => (
            <div
              key={key}
              className='relative p-6 rounded-2xl border bg-card/65 backdrop-blur-xs shadow-sm flex flex-col justify-between space-y-4'
            >
              <RiDoubleQuotesL className='w-8 h-8 text-primary/20 absolute top-4 left-4 pointer-events-none' />

              <p className='text-xs text-foreground/80 leading-relaxed italic relative z-10 pt-2'>
                &ldquo;{t(`list.${key}.comment`)}&rdquo;
              </p>

              {/* User info */}
              <div className='flex items-center gap-3 pt-3 border-t'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm'>
                  {t(`list.${key}.name`).charAt(0)}
                </div>
                <div>
                  <h4 className='text-xs font-bold text-foreground'>{t(`list.${key}.name`)}</h4>
                  <p className='text-4xs text-muted-foreground'>{t(`list.${key}.role`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
