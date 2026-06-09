'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { RiExternalLinkLine, RiGlobalLine, RiLoader4Line } from '@remixicon/react';

import Container from '@/components/shared/container';
import { getTemplatesAction } from '@/app/[locale]/admin/actions';
import WebsiteLivePreview from '@/components/shared/website-live-preview';

type Category = 'all' | 'web' | 'marketing' | 'brand';

interface ProjectItem {
  key: string;
  category: string;
  demoPath: string;
  thumbnailUrl: string | null;
  titleVi: string | null;
  titleEn: string | null;
  descVi: string | null;
  descEn: string | null;
}

export default function PortfolioMobile() {
  const t = useTranslations('portfolio');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories: Category[] = ['all', 'web', 'marketing', 'brand'];

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        const dbData = await getTemplatesAction();
        setProjects(dbData);
      } catch (err) {
        console.error('Failed to load portfolio projects:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const mapCategory = (cat: string): Category => {
    if (cat === 'web' || cat === 'intro' || cat === 'landing' || cat === 'sales') return 'web';
    if (cat === 'marketing') return 'marketing';
    return 'web';
  };

  const filteredProjects = projects
    .filter((p) => activeCategory === 'all' || mapCategory(p.category) === activeCategory)
    .slice(0, 6);

  const openDemo = (key: string) => {
    if (typeof window !== 'undefined') {
      window.open(`/${locale}/preview/${key}`, '_blank');
    }
  };

  return (
    <section className='py-16 border-t bg-background relative overflow-hidden'>
      <Container className='space-y-8 px-4'>
        {/* Section Header */}
        <div className='space-y-4 text-center'>
          <div className='space-y-2.5 max-w-sm mx-auto'>
            <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>{t('title')}</h2>
            <p className='text-sm text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
          </div>

          {/* Filter Slider */}
          <div className='-mx-4 px-4 overflow-x-auto flex gap-1.5 scrollbar-none py-1 justify-start min-[400px]:justify-center'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card border text-muted-foreground'
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Swipeable Horizontal Row */}
        {isLoading ? (
          <div className='flex items-center justify-center py-16 gap-3 text-muted-foreground'>
            <RiLoader4Line className='w-5 h-5 animate-spin' />
            <span className='text-sm font-semibold'>Đang tải...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground text-center'>
            <RiGlobalLine className='w-10 h-10 text-muted-foreground/40' />
            <p className='text-sm font-semibold'>Chưa có dự án nào</p>
          </div>
        ) : (
          <div className='-mx-4 px-4 overflow-x-auto snap-x flex gap-4 scrollbar-none py-2'>
            {filteredProjects.map((project) => (
              <div
                key={project.key}
                onClick={() => openDemo(project.key)}
                className='snap-center w-[280px] flex-shrink-0 rounded-2xl border bg-card/50 overflow-hidden shadow-md flex flex-col h-[340px] active:scale-[0.99] transition-transform duration-200 cursor-pointer group'
              >
                {/* Live scroll preview */}
                <div className='relative flex-1 overflow-hidden'>
                  <WebsiteLivePreview
                    src={project.demoPath}
                    thumbnailUrl={project.thumbnailUrl}
                    alt={project.titleVi || project.key}
                    height={220}
                  />
                  <div className='absolute inset-0 bg-background/20 backdrop-blur-2xs flex items-center justify-center z-30 pointer-events-none'>
                    <div className='px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md flex items-center gap-1.5'>
                      <span>Xem Demo</span>
                      <RiExternalLinkLine className='w-3.5 h-3.5' />
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className='p-4 space-y-1 bg-card'>
                  <span className='text-4xs font-bold uppercase tracking-wider text-primary'>
                    {t(`categories.${mapCategory(project.category)}`)}
                  </span>
                  <h3 className='text-sm font-bold text-foreground'>
                    {locale === 'vi'
                      ? project.titleVi || project.key
                      : project.titleEn || project.key}
                  </h3>
                  <p className='text-3xs text-muted-foreground line-clamp-2 leading-relaxed'>
                    {locale === 'vi' ? project.descVi || '' : project.descEn || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
