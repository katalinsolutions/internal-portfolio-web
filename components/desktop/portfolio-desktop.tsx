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

export default function PortfolioDesktop() {
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

  // Map DB category to portfolio category tabs
  const mapCategory = (cat: string): Category => {
    if (cat === 'web' || cat === 'intro' || cat === 'landing' || cat === 'sales') return 'web';
    if (cat === 'marketing') return 'marketing';
    return 'web';
  };

  const filteredProjects = projects
    .filter((p) => activeCategory === 'all' || mapCategory(p.category) === activeCategory)
    .slice(0, 6); // Hiển thị tối đa 6 trên homepage

  const openDemo = (key: string) => {
    if (typeof window !== 'undefined') {
      window.open(`/${locale}/preview/${key}`, '_blank');
    }
  };

  return (
    <section
      id='portfolio-section'
      className='py-24 border-t bg-background relative overflow-hidden'
    >
      {/* Background visual detail */}
      <div className='absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none' />

      <Container className='relative z-10 space-y-16'>
        {/* Section Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div className='space-y-4 max-w-2xl'>
            <h2 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
              {t('title')}
            </h2>
            <p className='text-lg text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
          </div>

          {/* Filter Categories */}
          <div className='flex flex-wrap items-center gap-2 p-1.5 rounded-full border bg-card/65 backdrop-blur-md w-fit'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className='flex items-center justify-center py-24 gap-3 text-muted-foreground'>
            <RiLoader4Line className='w-6 h-6 animate-spin' />
            <span className='text-sm font-semibold'>Đang tải dự án...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground'>
            <RiGlobalLine className='w-12 h-12 text-muted-foreground/40' />
            <p className='text-sm font-semibold'>Chưa có dự án nào</p>
            <p className='text-xs text-center max-w-xs'>
              Thêm website mẫu trong trang Admin để hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredProjects.map((project) => (
              <div
                key={project.key}
                onClick={() => openDemo(project.key)}
                className='group relative rounded-3xl border bg-card/45 overflow-hidden shadow-lg hover:shadow-2xl hover:border-primary/10 hover:scale-[1.02] transition-all duration-300 flex flex-col h-[420px] animate-fade-in cursor-pointer'
              >
                {/* Live scroll preview */}
                <div className='relative flex-1 overflow-hidden border-b'>
                  <WebsiteLivePreview
                    src={project.demoPath}
                    thumbnailUrl={project.thumbnailUrl}
                    alt={project.titleVi || project.key}
                    height={290}
                  />
                  {/* Overlay CTA */}
                  <div className='absolute inset-0 bg-background/30 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30'>
                    <div className='px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2'>
                      <span>Trải nghiệm Demo</span>
                      <RiExternalLinkLine className='w-4 h-4' />
                    </div>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className='p-6 space-y-2 bg-card relative z-10'>
                  <span className='text-3xs font-bold uppercase tracking-wider text-primary'>
                    {t(`categories.${mapCategory(project.category)}`)}
                  </span>
                  <h3 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors'>
                    {locale === 'vi'
                      ? project.titleVi || project.key
                      : project.titleEn || project.key}
                  </h3>
                  <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
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
