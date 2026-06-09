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

export default function AboutMobile() {
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
    <section className='py-16 border-t bg-background/50 relative overflow-hidden'>
      <Container className='space-y-12 px-4'>
        {/* Content Story */}
        <div className='space-y-6 text-center'>
          <div className='space-y-2.5 mx-auto max-w-sm'>
            <span className='text-3xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full'>
              {t('subtitle')}
            </span>
            <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>{t('title')}</h2>
          </div>

          <div className='space-y-4 text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto text-left'>
            <p className='relative pl-5 border-l-2 border-primary/40 italic text-foreground/85 py-1'>
              <RiDoubleQuotesR className='absolute -top-1 left-0 w-3.5 h-3.5 text-primary/30 transform translate-x-2' />
              {t('desc1')}
            </p>
            <p className='pl-5'>{t('desc2')}</p>
          </div>
        </div>

        {/* Statistics 2x2 Grid */}
        <div className='grid grid-cols-2 gap-4 max-w-sm mx-auto'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='p-4 rounded-2xl border bg-card/65 backdrop-blur-xs flex flex-col items-center text-center space-y-2'
              >
                <div className={`p-2.5 rounded-xl border border-transparent ${stat.color}`}>
                  <Icon className='w-5 h-5' />
                </div>
                <div className='space-y-0.5'>
                  <div className='text-xl font-black text-foreground'>{stat.value}</div>
                  <div className='text-4xs font-bold text-muted-foreground uppercase tracking-wider'>
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
