'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { RiCheckboxCircleFill, RiStarFill, RiLoader4Line } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';
import { getPricingPlansAction } from '@/app/[locale]/admin/actions';
import { PricingPlan } from '@/lib/db';

export default function PricingDesktop() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        setIsLoading(true);
        const data = await getPricingPlansAction();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load pricing plans:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlans();
  }, []);

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
        {isLoading ? (
          <div className='flex items-center justify-center py-24 gap-3 text-muted-foreground'>
            <RiLoader4Line className='w-6 h-6 animate-spin text-primary' />
            <span className='text-sm font-semibold'>Đang tải bảng giá...</span>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto'>
            {plans.map((plan) => {
              const name = locale === 'vi' ? plan.nameVi : plan.nameEn;
              const desc = locale === 'vi' ? plan.descVi : plan.descEn;
              const price = locale === 'vi' ? plan.priceVi : plan.priceEn;
              const period = locale === 'vi' ? plan.periodVi : plan.periodEn;
              const features = locale === 'vi' ? plan.featuresVi : plan.featuresEn;
              const borderClass = plan.isPopular
                ? 'border-primary/50 bg-card shadow-2xl relative scale-[1.03] z-10 shadow-primary/5'
                : 'border-border bg-card/40 backdrop-blur-sm';

              return (
                <div
                  key={plan.key}
                  className={`flex flex-col justify-between p-8 rounded-3xl border h-[550px] transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${
                    plan.isPopular ? 'pt-14 relative' : 'relative'
                  } ${borderClass}`}
                >
                  {/* Popular Header Band */}
                  {plan.isPopular && (
                    <div className='absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-blue-600 via-primary to-indigo-600 rounded-t-[22px] flex items-center justify-center gap-1.5 text-white text-xs font-bold uppercase tracking-wider'>
                      <RiStarFill className='w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse' />
                      BÁN CHẠY NHẤT / BEST SELLER
                    </div>
                  )}

                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <h3 className='text-xl font-bold text-foreground'>{name}</h3>
                      <p className='text-xs text-muted-foreground min-h-[40px] leading-relaxed'>
                        {desc}
                      </p>
                    </div>

                    {/* Price */}
                    <div className='flex items-baseline gap-1 pt-2'>
                      <span className='text-4xl lg:text-5xl font-black text-foreground'>
                        {price}
                      </span>
                      {period && (
                        <span className='text-xs text-muted-foreground font-medium'>
                          / {period}
                        </span>
                      )}
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
                    {plan.key === 'enterprise' ? 'Liên Hệ' : 'Chọn Gói'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
