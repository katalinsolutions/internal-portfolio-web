'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RiCheckboxCircleFill } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';

type PlanKey = 'starter' | 'growth' | 'enterprise';

export default function PricingMobile() {
  const t = useTranslations('pricing');
  const [activeTab, setActiveTab] = useState<PlanKey>('growth');

  const plans: { key: PlanKey; isPopular: boolean }[] = [
    { key: 'starter', isPopular: false },
    { key: 'growth', isPopular: true },
    { key: 'enterprise', isPopular: false },
  ];

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentPlan = plans.find((p) => p.key === activeTab)!;
  const features = t.raw(`${currentPlan.key}.features`) as string[];

  return (
    <section className='py-16 border-t bg-background relative overflow-hidden'>
      <Container className='space-y-8 px-4'>
        {/* Section Header */}
        <div className='text-center space-y-2.5 max-w-sm mx-auto'>
          <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>{t('title')}</h2>
          <p className='text-sm text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {/* Tab Switcher */}
        <div className='grid grid-cols-3 gap-1 p-1 rounded-xl border bg-card/65 max-w-sm mx-auto'>
          {plans.map((plan) => (
            <button
              key={plan.key}
              onClick={() => setActiveTab(plan.key)}
              className={`py-2 rounded-lg text-2xs font-bold transition-all relative ${
                activeTab === plan.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              {t(`${plan.key}.name`).split(' ')[0]}
              {plan.isPopular && (
                <span className='absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-4xs font-black uppercase tracking-wider scale-75 border border-background'>
                  HOT
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Pricing Card */}
        <div className='w-full max-w-sm mx-auto p-6 rounded-2xl border bg-card/50 backdrop-blur-xs flex flex-col justify-between h-[480px] shadow-lg relative transition-all duration-300'>
          {currentPlan.isPopular && (
            <span className='absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-4xs font-extrabold uppercase tracking-widest border border-background'>
              BÁN CHẠY NHẤT / BEST SELLER
            </span>
          )}

          <div className='space-y-4'>
            <div className='space-y-1'>
              <h3 className='text-lg font-bold text-foreground'>{t(`${currentPlan.key}.name`)}</h3>
              <p className='text-2xs text-muted-foreground leading-relaxed min-h-[32px]'>
                {t(`${currentPlan.key}.desc`)}
              </p>
            </div>

            {/* Price */}
            <div className='flex items-baseline gap-1 pt-1'>
              <span className='text-3xl font-black text-foreground'>
                {t(`${currentPlan.key}.price`)}
              </span>
              <span className='text-3xs text-muted-foreground font-medium'>
                / {t(`${currentPlan.key}.period`)}
              </span>
            </div>

            {/* Features List */}
            <ul className='space-y-2.5 pt-3 border-t'>
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className='flex items-start gap-2 text-xs text-foreground/85 leading-relaxed'
                >
                  <RiCheckboxCircleFill
                    className={`w-4.5 h-4.5 flex-shrink-0 ${currentPlan.isPopular ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={scrollToContact}
            className={`w-full py-5 rounded-xl font-bold text-xs transition-all ${
              currentPlan.isPopular
                ? 'bg-primary hover:bg-primary/95 text-primary-foreground shadow-md'
                : 'border border-border bg-card'
            }`}
          >
            {currentPlan.key === 'enterprise' ? 'Liên Hệ Ngay' : 'Chọn Gói Này'}
          </Button>
        </div>
      </Container>
    </section>
  );
}
