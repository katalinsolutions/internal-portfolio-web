'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { RiCheckboxCircleFill, RiStarFill, RiLoader4Line } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';
import { getPricingPlansAction } from '@/app/[locale]/admin/actions';
import { PricingPlan } from '@/lib/db';

export default function PricingMobile() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        setIsLoading(true);
        const data = await getPricingPlansAction();
        setPlans(data);
        const popular = data.find((p) => p.isPopular);
        if (popular) {
          setActiveTab(popular.key);
        } else if (data.length > 0) {
          setActiveTab(data[0].key);
        }
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

  const currentPlan = plans.find((p) => p.key === activeTab);
  const name = currentPlan ? (locale === 'vi' ? currentPlan.nameVi : currentPlan.nameEn) : '';
  const desc = currentPlan ? (locale === 'vi' ? currentPlan.descVi : currentPlan.descEn) : '';
  const price = currentPlan ? (locale === 'vi' ? currentPlan.priceVi : currentPlan.priceEn) : '';
  const period = currentPlan ? (locale === 'vi' ? currentPlan.periodVi : currentPlan.periodEn) : '';
  const features = currentPlan
    ? locale === 'vi'
      ? currentPlan.featuresVi
      : currentPlan.featuresEn
    : [];

  return (
    <section className='py-16 border-t bg-background relative overflow-hidden'>
      <Container className='space-y-8 px-4'>
        {/* Section Header */}
        <div className='text-center space-y-2.5 max-w-sm mx-auto'>
          <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>{t('title')}</h2>
          <p className='text-sm text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-12 gap-2 text-muted-foreground'>
            <RiLoader4Line className='w-5 h-5 animate-spin text-primary' />
            <span>Đang tải bảng giá...</span>
          </div>
        ) : plans.length === 0 ? null : (
          <>
            {/* Tab Switcher */}
            <div className='grid grid-flow-col auto-cols-fr gap-1 p-1 rounded-xl border bg-card/65 max-w-sm mx-auto'>
              {plans.map((plan) => {
                const tabName = locale === 'vi' ? plan.nameVi : plan.nameEn;
                return (
                  <button
                    key={plan.key}
                    onClick={() => setActiveTab(plan.key)}
                    className={`py-2 rounded-lg text-2xs font-bold transition-all relative truncate px-1 cursor-pointer ${
                      activeTab === plan.key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {tabName.split(' ')[0]}
                    {plan.isPopular && (
                      <span className='absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white text-4xs font-black uppercase tracking-wider scale-75 border border-background shadow-sm shadow-orange-500/20'>
                        HOT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Pricing Card */}
            {currentPlan && (
              <div
                className={`w-full max-w-sm mx-auto p-6 rounded-2xl border bg-card/50 backdrop-blur-xs flex flex-col justify-between h-[480px] shadow-lg relative transition-all duration-300 ${
                  currentPlan.isPopular ? 'pt-12' : ''
                }`}
              >
                {currentPlan.isPopular && (
                  <div className='absolute top-0 left-0 right-0 h-9 bg-gradient-to-r from-blue-600 via-primary to-indigo-600 rounded-t-[14px] flex items-center justify-center gap-1 text-white text-3xs font-bold uppercase tracking-wider'>
                    <RiStarFill className='w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse' />
                    BÁN CHẠY NHẤT / BEST SELLER
                  </div>
                )}

                <div className='space-y-4'>
                  <div className='space-y-1'>
                    <h3 className='text-lg font-bold text-foreground'>{name}</h3>
                    <p className='text-2xs text-muted-foreground leading-relaxed min-h-[32px]'>
                      {desc}
                    </p>
                  </div>

                  {/* Price */}
                  <div className='flex items-baseline gap-1 pt-1'>
                    <span className='text-3xl font-black text-foreground'>{price}</span>
                    {period && (
                      <span className='text-3xs text-muted-foreground font-medium'>/ {period}</span>
                    )}
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
                  className={`w-full py-5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentPlan.isPopular
                      ? 'bg-primary hover:bg-primary/95 text-primary-foreground shadow-md'
                      : 'border border-border bg-card'
                  }`}
                  variant={currentPlan.buttonVariant}
                >
                  {currentPlan.key === 'enterprise' ? 'Liên Hệ Ngay' : 'Chọn Gói Này'}
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
