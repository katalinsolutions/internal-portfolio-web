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
        className='w-full flex items-center justify-between p-4 text-left text-xs font-bold text-foreground/90 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer'
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

  return (
    <section id='pricing-section' className='py-24 border-t bg-background relative overflow-hidden'>
      {/* Glow background */}
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
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto'>
            {plans.map((plan) => {
              const name = locale === 'vi' ? plan.nameVi : plan.nameEn;
              const desc = locale === 'vi' ? plan.descVi : plan.descEn;
              const price = locale === 'vi' ? plan.priceVi : plan.priceEn;
              const period = locale === 'vi' ? plan.periodVi : plan.periodEn;
              const features = locale === 'vi' ? plan.featuresVi : plan.featuresEn;
              const parsed = parseFeatures(features);

              const borderClass = plan.isPopular
                ? 'border-primary/60 bg-card shadow-2xl scale-[1.03] z-10 shadow-primary/5'
                : 'border-border bg-card/45 backdrop-blur-xs';

              return (
                <div
                  key={plan.key}
                  className={`flex flex-col p-8 rounded-3xl border min-h-[580px] h-auto transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${
                    plan.isPopular ? 'pt-16 relative' : 'relative'
                  } ${borderClass}`}
                >
                  {/* Popular Header Band */}
                  {plan.isPopular && (
                    <div className='absolute top-0 left-0 right-0 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-[22px] flex items-center justify-center gap-2 text-white text-xs font-black uppercase tracking-wider shadow-md'>
                      <span className='animate-bounce text-sm'>⭐</span>
                      {locale === 'vi' ? 'KHUYÊN DÙNG' : 'RECOMMENDED'}
                    </div>
                  )}

                  {/* Top: Header Spec */}
                  <div className='flex flex-col text-center space-y-4 flex-shrink-0'>
                    <h3 className='text-md font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest'>
                      {name}
                    </h3>

                    <div className='flex items-baseline justify-center gap-1'>
                      <span className='text-3xl lg:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400'>
                        {price}
                      </span>
                      {period && (
                        <span className='text-xs text-muted-foreground font-semibold'>
                          / {period}
                        </span>
                      )}
                    </div>

                    <p className='text-2xs text-muted-foreground leading-relaxed max-w-[240px] mx-auto min-h-[36px]'>
                      {desc}
                    </p>

                    {plan.isPopular && (
                      <div className='inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-extrabold mx-auto select-none'>
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
                      variant={plan.buttonVariant}
                      onClick={scrollToContact}
                      className={`w-full max-w-[240px] mx-auto py-5.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer ${
                        plan.isPopular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                          : 'border border-border hover:bg-accent'
                      }`}
                    >
                      {plan.key === 'enterprise'
                        ? locale === 'vi'
                          ? 'Liên Hệ'
                          : 'Get Quote'
                        : locale === 'vi'
                          ? 'TƯ VẤN BÁO GIÁ'
                          : 'SELECT PLAN'}
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className='w-full h-px bg-slate-100 dark:bg-slate-800/80 my-5 flex-shrink-0' />

                  {/* Bottom: Features List */}
                  <div className='space-y-1 text-left flex-1'>
                    {parsed.map((item, idx) => {
                      switch (item.type) {
                        case 'section':
                          return (
                            <div
                              key={idx}
                              className='text-2xs font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase pt-5 pb-1.5 first:pt-0 border-b border-dashed border-slate-100 dark:border-slate-800/60 mb-2'
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
                              className='p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-100/80 dark:border-emerald-900/30 my-4 space-y-2.5'
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
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
