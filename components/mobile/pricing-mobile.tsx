'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { RiLoader4Line } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';
import { getPricingPlansAction } from '@/app/[locale]/admin/actions';
import { PricingPlan } from '@/lib/db';

// ─── Sub-component: AccordionItem ───────────────────────────────────────────
function AccordionItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasMoi = title.includes('[MỚI]');
  const cleanTitle = title.replace('[MỚI]', '').trim();

  return (
    <div className='border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden my-3 transition-all duration-200'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-foreground/90 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer'
      >
        <span className='flex items-center gap-2.5'>
          <span className='text-purple-500 text-sm'>✨</span>
          <span>{cleanTitle}</span>
          {hasMoi && (
            <span className='bg-emerald-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase scale-90'>
              MỚI
            </span>
          )}
        </span>
        <span
          className={`transform transition-transform text-slate-400 text-[10px] ${isOpen ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className='px-4 pb-4 pt-1 text-2xs text-muted-foreground leading-relaxed border-t border-slate-150 dark:border-slate-800/60'>
          {content}
        </div>
      )}
    </div>
  );
}

// ─── Parsed Feature Type ─────────────────────────────────────────────────────
type ParsedFeature =
  | { type: 'section'; name: string }
  | { type: 'key-value'; key: string; value: string }
  | { type: 'simple'; text: string }
  | { type: 'check' | 'cross'; text: string }
  | { type: 'ai-box'; title: string; desc: string; items: string[] }
  | { type: 'accordion'; title: string; content: string };

export default function PricingMobile() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [activeTab, setActiveTab] = useState<string>('growth');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        setIsLoading(true);
        const data = await getPricingPlansAction();
        setPlans(data);
        // Chọn gói nổi bật hoặc gói đầu tiên làm mặc định
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

  // Helper: Parse flat mảng features thành các khối UI có cấu trúc
  const parseFeatures = (features: string[]): ParsedFeature[] => {
    const result: ParsedFeature[] = [];
    let currentAiBox: { title: string; desc: string; items: string[] } | null = null;

    for (const f of features) {
      const trimmed = f.trim();
      if (!trimmed) continue;

      if (currentAiBox && !trimmed.startsWith('[ai-item]')) {
        result.push({ type: 'ai-box', ...currentAiBox });
        currentAiBox = null;
      }

      if (trimmed.startsWith('[section]')) {
        result.push({ type: 'section', name: trimmed.replace('[section]', '').trim() });
      } else if (trimmed.startsWith('[ai-box]')) {
        const content = trimmed.replace('[ai-box]', '').trim();
        const parts = content.split('|');
        const title = parts[0]?.trim() || '';
        const desc = parts[1]?.trim() || '';
        currentAiBox = { title, desc, items: [] };
      } else if (trimmed.startsWith('[ai-item]')) {
        const itemText = trimmed.replace('[ai-item]', '').trim();
        if (currentAiBox) {
          currentAiBox.items.push(itemText);
        } else {
          result.push({ type: 'simple', text: itemText });
        }
      } else if (trimmed.startsWith('[accordion]')) {
        const content = trimmed.replace('[accordion]', '').trim();
        const parts = content.split('|');
        const title = parts[0]?.trim() || '';
        const body = parts[1]?.trim() || '';
        result.push({ type: 'accordion', title, content: body });
      } else if (trimmed.startsWith('[check]')) {
        result.push({ type: 'check', text: trimmed.replace('[check]', '').trim() });
      } else if (trimmed.startsWith('[cross]')) {
        result.push({ type: 'cross', text: trimmed.replace('[cross]', '').trim() });
      } else if (trimmed.includes(':')) {
        const colonIndex = trimmed.indexOf(':');
        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();
        result.push({ type: 'key-value', key, value });
      } else {
        result.push({ type: 'simple', text: trimmed });
      }
    }

    if (currentAiBox) {
      result.push({ type: 'ai-box', ...currentAiBox });
    }

    return result;
  };

  // Helper: Phân tích các thẻ gạch ngang (~~text~~) và in đậm xanh (**text**)
  const parseValue = (text: string) => {
    const regex = /(~~[^~]+~~|\*\*[^*]+\*\*)/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.startsWith('~~') && part.endsWith('~~')) {
        return (
          <span
            key={index}
            className='line-through text-slate-400 dark:text-slate-500 mr-1.5 font-normal'
          >
            {part.slice(2, -2)}
          </span>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className='font-extrabold text-blue-600 dark:text-blue-400'>
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
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
  const parsed = parseFeatures(features);

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
                className={`w-full max-w-sm mx-auto p-6 rounded-2xl border bg-card/50 backdrop-blur-xs flex flex-col min-h-[480px] h-auto shadow-lg relative transition-all duration-300 pb-6 ${
                  currentPlan.isPopular ? 'pt-12' : 'pt-6'
                } ${
                  currentPlan.isPopular
                    ? 'border-primary/50 bg-card shadow-xl'
                    : 'border-border bg-card/40'
                }`}
              >
                {currentPlan.isPopular && (
                  <div className='absolute top-0 left-0 right-0 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-[14px] flex items-center justify-center gap-1.5 text-white text-3xs font-black uppercase tracking-wider'>
                    <span className='animate-bounce text-2xs'>⭐</span>
                    {locale === 'vi' ? 'KHUYÊN DÙNG' : 'RECOMMENDED'}
                  </div>
                )}

                {/* Top: Header Spec */}
                <div className='flex flex-col text-center space-y-3 flex-shrink-0 pt-2'>
                  <h3 className='text-md font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest'>
                    {name}
                  </h3>

                  <div className='flex items-baseline justify-center gap-1'>
                    <span className='text-3xl font-extrabold text-emerald-600 dark:text-emerald-400'>
                      {price}
                    </span>
                    {period && (
                      <span className='text-2xs text-muted-foreground font-semibold'>
                        / {period}
                      </span>
                    )}
                  </div>

                  <p className='text-2xs text-muted-foreground leading-relaxed max-w-[245px] mx-auto min-h-[32px]'>
                    {desc}
                  </p>

                  {currentPlan.isPopular && (
                    <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-[9px] font-extrabold mx-auto select-none'>
                      <span className='w-4.5 h-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black'>
                        AI
                      </span>
                      <span>
                        {locale === 'vi'
                          ? 'AI đề xuất cho tăng chuyển đổi'
                          : 'AI recommended for conversion'}
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={scrollToContact}
                    className={`w-full max-w-[240px] mx-auto py-5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer ${
                      currentPlan.isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                        : 'border border-border hover:bg-accent'
                    }`}
                    variant={currentPlan.buttonVariant}
                  >
                    {currentPlan.key === 'enterprise'
                      ? locale === 'vi'
                        ? 'Liên Hệ'
                        : 'Get Quote'
                      : locale === 'vi'
                        ? 'TƯ VẤN BÁO GIÁ'
                        : 'SELECT PLAN'}
                  </Button>
                </div>

                {/* Divider */}
                <div className='w-full h-px bg-slate-100 dark:bg-slate-800/80 my-4 flex-shrink-0' />

                {/* Bottom: Features List */}
                <div className='space-y-1 text-left flex-1'>
                  {parsed.map((item, idx) => {
                    switch (item.type) {
                      case 'section':
                        return (
                          <div
                            key={idx}
                            className='text-2xs font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase pt-4 pb-1 first:pt-0 border-b border-dashed border-slate-100 dark:border-slate-800/60 mb-1.5'
                          >
                            {item.name}
                          </div>
                        );
                      case 'key-value':
                        return (
                          <div
                            key={idx}
                            className='flex justify-between items-start py-2 border-b border-dashed border-slate-100 dark:border-slate-800/40 text-2xs'
                          >
                            <span className='text-slate-500 dark:text-slate-400 font-medium'>
                              {item.key}:
                            </span>
                            <span className='text-right font-semibold text-foreground'>
                              {parseValue(item.value)}
                            </span>
                          </div>
                        );
                      case 'simple':
                        return (
                          <div
                            key={idx}
                            className='py-2 border-b border-dashed border-slate-100 dark:border-slate-800/40 text-2xs text-foreground/80 font-medium leading-relaxed'
                          >
                            {parseValue(item.text)}
                          </div>
                        );
                      case 'check':
                        return (
                          <div
                            key={idx}
                            className='flex items-start gap-2 py-2 border-b border-dashed border-slate-100 dark:border-slate-800/40 text-2xs text-foreground/85 font-medium'
                          >
                            <span className='text-emerald-600 dark:text-emerald-400 font-black text-xs flex-shrink-0 leading-none mt-0.5'>
                              ✓
                            </span>
                            <span className='leading-relaxed'>{item.text}</span>
                          </div>
                        );
                      case 'cross':
                        return (
                          <div
                            key={idx}
                            className='flex items-start gap-2 py-2 border-b border-dashed border-slate-100 dark:border-slate-800/40 text-2xs text-slate-400 dark:text-slate-500 font-medium'
                          >
                            <span className='text-rose-500 font-black text-xs flex-shrink-0 leading-none mt-0.5'>
                              ✗
                            </span>
                            <span className='leading-relaxed line-through'>{item.text}</span>
                          </div>
                        );
                      case 'ai-box':
                        return (
                          <div
                            key={idx}
                            className='p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-100/80 dark:border-emerald-900/30 my-3 space-y-2.5'
                          >
                            <h4 className='text-2xs font-black text-emerald-700 dark:text-emerald-400 tracking-wider uppercase'>
                              {item.title}
                            </h4>
                            {item.desc && (
                              <p className='text-3xs text-muted-foreground leading-relaxed'>
                                {item.desc}
                              </p>
                            )}
                            <ul className='space-y-2 pt-0.5'>
                              {item.items.map((sub, sIdx) => (
                                <li
                                  key={sIdx}
                                  className='flex items-start text-2xs text-foreground/80 leading-relaxed font-medium'
                                >
                                  <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 block flex-shrink-0 mt-1.5 mr-2' />
                                  <span>{sub}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      case 'accordion':
                        return (
                          <AccordionItem key={idx} title={item.title} content={item.content} />
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
