'use client';

import { useTranslations } from 'next-intl';
import { RiCheckboxCircleFill } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';

export default function PricingDesktop() {
  const t = useTranslations('pricing');

  const plans = [
    {
      key: 'starter',
      isPopular: false,
      buttonVariant: 'outline' as const,
      borderClass: 'border-border bg-card/40 backdrop-blur-sm',
    },
    {
      key: 'growth',
      isPopular: true,
      buttonVariant: 'default' as const,
      borderClass:
        'border-primary/50 bg-card shadow-2xl relative scale-[1.03] z-10 shadow-primary/5',
    },
    {
      key: 'enterprise',
      isPopular: false,
      buttonVariant: 'outline' as const,
      borderClass: 'border-border bg-card/40 backdrop-blur-sm',
    },
  ];

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id='pricing-section' className='py-24 border-t bg-background relative overflow-hidden'>
      {/* Background glow effects */}
      <div className='absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none' />

      <Container className='relative z-10 space-y-16'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto space-y-4'>
          <h2 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
            {t('title')}
          </h2>
          <p className='text-lg text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {/* Pricing Cards Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto'>
          {plans.map((plan) => {
            const features = t.raw(`${plan.key}.features`) as string[];
            return (
              <div
                key={plan.key}
                className={`flex flex-col justify-between p-8 rounded-3xl border h-[550px] transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${plan.borderClass}`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <span className='absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-2xs font-extrabold uppercase tracking-widest shadow-md'>
                    BÁN CHẠY NHẤT / BEST SELLER
                  </span>
                )}

                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <h3 className='text-xl font-bold text-foreground'>{t(`${plan.key}.name`)}</h3>
                    <p className='text-xs text-muted-foreground min-h-[40px] leading-relaxed'>
                      {t(`${plan.key}.desc`)}
                    </p>
                  </div>

                  {/* Price */}
                  <div className='flex items-baseline gap-1 pt-2'>
                    <span className='text-4xl lg:text-5xl font-black text-foreground'>
                      {t(`${plan.key}.price`)}
                    </span>
                    <span className='text-xs text-muted-foreground font-medium'>
                      / {t(`${plan.key}.period`)}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className='space-y-3.5 pt-4 border-t'>
                    {features.map((feature, idx) => (
                      <li
                        key={idx}
                        className='flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed'
                      >
                        <RiCheckboxCircleFill
                          className={`w-5 h-5 flex-shrink-0 ${plan.isPopular ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.buttonVariant}
                  onClick={scrollToContact}
                  className={`w-full py-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20'
                      : 'border-border hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {
                    plan.key === 'enterprise'
                      ? t('starter.name').split(' ')[0]
                      : t('starter.name').split(' ')[0] /* Dummy standard text */
                  }
                  {plan.key === 'enterprise' ? 'Liên Hệ' : 'Chọn Gói'}
                </Button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
