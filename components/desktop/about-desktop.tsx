'use client';

import { useTranslations } from 'next-intl';
import {
  RiDoubleQuotesR,
  RiTeamLine,
  RiAwardLine,
  RiLineChartLine,
  RiUserHeartLine,
} from '@remixicon/react';

import Container from '@/components/shared/container';

export default function AboutDesktop() {
  const t = useTranslations('about');

  const stats = [
    { key: 'projects', value: '150+', icon: RiAwardLine, color: 'text-blue-500 bg-blue-500/5' },
    {
      key: 'clients',
      value: '80+',
      icon: RiUserHeartLine,
      color: 'text-emerald-500 bg-emerald-500/5',
    },
    {
      key: 'conversion',
      value: '+180%',
      icon: RiLineChartLine,
      color: 'text-rose-500 bg-rose-500/5',
    },
    { key: 'support', value: '24/7', icon: RiTeamLine, color: 'text-purple-500 bg-purple-500/5' },
  ];

  return (
    <section
      id='about-section'
      className='py-24 border-t bg-background/50 relative overflow-hidden'
    >
      {/* Background radial glow */}
      <div className='absolute bottom-0 right-10 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none' />

      <Container className='relative z-10 grid grid-cols-12 gap-16 items-center'>
        {/* Left Side: Story & Vision */}
        <div className='col-span-6 space-y-8'>
          <div className='space-y-4'>
            <span className='text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full'>
              {t('subtitle')}
            </span>
            <h2 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
              {t('title')}
            </h2>
          </div>

          <div className='space-y-6 text-base text-muted-foreground leading-relaxed'>
            <p className='relative pl-6 border-l-2 border-primary/40 italic text-foreground/80'>
              <RiDoubleQuotesR className='absolute -top-3 left-0 w-4 h-4 text-primary/30 transform translate-x-2' />
              {t('desc1')}
            </p>
            <p>{t('desc2')}</p>
          </div>
        </div>

        {/* Right Side: Statistics Grid */}
        <div className='col-span-6 grid grid-cols-2 gap-6'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='group relative p-6 rounded-3xl border bg-card/60 backdrop-blur-md shadow-md hover:shadow-xl hover:border-primary/10 hover:scale-[1.02] transition-all duration-300 flex items-start gap-4'
              >
                <div
                  className={`p-3 rounded-2xl border border-transparent ${stat.color} group-hover:border-primary/20 transition-all duration-300`}
                >
                  <Icon className='w-6 h-6' />
                </div>
                <div className='space-y-1'>
                  <div className='text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors'>
                    {stat.value}
                  </div>
                  <div className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                    {t(`stats.${stat.key}`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
