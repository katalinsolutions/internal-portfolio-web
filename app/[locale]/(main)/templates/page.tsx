'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  RiSearchLine,
  RiArrowUpDownLine,
  RiExternalLinkLine,
  RiShoppingBag3Line,
  RiServiceLine,
  RiBriefcaseLine,
  RiFileTextLine,
  RiQuestionMark,
  RiDiscussLine,
  RiGlobalLine,
  RiLoader4Line,
} from '@remixicon/react';

import Container from '@/components/shared/container';
import { getTemplatesAction } from '@/app/[locale]/admin/actions';
import WebsiteLivePreview from '@/components/shared/website-live-preview';

type CategoryType =
  | 'all'
  | 'sales'
  | 'services'
  | 'intro'
  | 'landing'
  | 'web'
  | 'marketing'
  | 'uncategorized';
type SortType = 'default' | 'newest' | 'popular';

interface TemplateItem {
  key: string;
  category: string;
  demoPath: string;
  thumbnailUrl: string | null;
  titleVi: string | null;
  titleEn: string | null;
  descVi: string | null;
  descEn: string | null;
}

// Gradient colors fallback khi không có thumbnail
const CARD_GRADIENTS = [
  {
    bg: 'from-slate-900 to-indigo-950',
    accent: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  },
  {
    bg: 'from-amber-50/20 to-rose-100/30',
    accent: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
  },
  {
    bg: 'from-emerald-50/20 to-green-100/20',
    accent: 'bg-green-600/10 border-green-600/20 text-green-600',
  },
  {
    bg: 'from-zinc-900 to-neutral-950',
    accent: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
  },
  {
    bg: 'from-neutral-900 to-amber-950',
    accent: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
  },
  {
    bg: 'from-emerald-950 to-emerald-900',
    accent: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
  },
  { bg: 'from-blue-950 to-indigo-900', accent: 'bg-blue-400/10 border-blue-400/20 text-blue-400' },
  {
    bg: 'from-violet-950 to-purple-900',
    accent: 'bg-violet-400/10 border-violet-400/20 text-violet-400',
  },
];

export default function TemplatesPage() {
  const t = useTranslations('templates');
  const locale = useLocale();

  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [templatesList, setTemplatesList] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load từ Supabase
  useEffect(() => {
    async function loadTemplates() {
      try {
        setIsLoading(true);
        const dbData = await getTemplatesAction();
        setTemplatesList(dbData);
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTemplates();
  }, []);

  // Đọc query params từ URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const search = params.get('search');

    setTimeout(() => {
      if (cat) setActiveCategory(cat as CategoryType);
      if (search) {
        setSearchQuery(search);
        setAppliedSearch(search);
      }
    }, 0);
  }, []);

  // Các loại danh mục có trong dữ liệu
  const allCategories = useMemo(() => {
    const cats = new Set(templatesList.map((t) => t.category));
    return Array.from(cats);
  }, [templatesList]);

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'sales':
        return <RiShoppingBag3Line className='w-4 h-4' />;
      case 'services':
        return <RiServiceLine className='w-4 h-4' />;
      case 'intro':
        return <RiBriefcaseLine className='w-4 h-4' />;
      case 'landing':
        return <RiFileTextLine className='w-4 h-4' />;
      case 'web':
        return <RiGlobalLine className='w-4 h-4' />;
      case 'marketing':
        return <RiGlobalLine className='w-4 h-4' />;
      default:
        return <RiQuestionMark className='w-4 h-4' />;
    }
  };

  const categories: { key: CategoryType; icon: React.ReactNode; count: number }[] = [
    { key: 'all', icon: <RiFileTextLine className='w-4 h-4' />, count: templatesList.length },
    ...allCategories.map((cat) => ({
      key: cat as CategoryType,
      icon: getCategoryIcon(cat),
      count: templatesList.filter((t) => t.category === cat).length,
    })),
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') setAppliedSearch('');
  };

  const filteredTemplates = useMemo(() => {
    return templatesList
      .filter((theme) => {
        const matchesCategory = activeCategory === 'all' || theme.category === activeCategory;
        const title = (locale === 'vi' ? theme.titleVi : theme.titleEn) || theme.key;
        const matchesSearch =
          appliedSearch === '' ||
          title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          theme.key.toLowerCase().includes(appliedSearch.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.key.localeCompare(a.key);
        return 0;
      });
  }, [activeCategory, appliedSearch, sortBy, templatesList, locale]);

  const openPreview = (key: string) => {
    if (typeof window !== 'undefined') {
      window.open(`/${locale}/preview/${key}`, '_blank');
    }
  };

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      sales: 'Bán hàng',
      services: 'Dịch vụ',
      intro: 'Giới thiệu',
      landing: 'Landing Page',
      web: 'Thiết kế Web',
      marketing: 'Marketing',
    };
    return map[cat] || cat;
  };

  return (
    <div className='w-full min-h-screen bg-slate-50/50 dark:bg-zinc-950/20 py-12 md:py-16'>
      <Container className='px-4 space-y-10'>
        {/* Page Header */}
        <div className='text-center max-w-3xl mx-auto space-y-4'>
          <h1 className='text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl'>
            {t('title')}
          </h1>
          <p className='text-lg text-muted-foreground leading-relaxed'>{t('subtitle')}</p>
        </div>

        {/* Main Work Area */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
          {/* Left Sidebar Filter */}
          <div className='lg:col-span-1 space-y-6 lg:sticky lg:top-24'>
            <div className='bg-card border rounded-3xl p-6 shadow-sm space-y-6'>
              <h2 className='text-xs font-black uppercase tracking-wider text-primary'>
                {t('sidebar.title')}
              </h2>
              <div className='space-y-1.5 flex flex-col'>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      activeCategory === cat.key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <div className='flex items-center gap-2.5'>
                      {cat.icon}
                      <span>
                        {cat.key === 'all' ? t('sidebar.all') : getCategoryLabel(cat.key)}
                      </span>
                    </div>
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                        activeCategory === cat.key
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Need Help Box */}
            <div className='bg-[#0b132b] text-white border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden group'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none' />
              <div className='space-y-2 relative z-10'>
                <span className='text-4xs font-mono font-bold text-primary tracking-widest uppercase block'>
                  {t('sidebar.needHelp')}
                </span>
                <h3 className='text-base font-black leading-snug'>{t('sidebar.needHelpDesc')}</h3>
              </div>
              <button
                onClick={scrollToContact}
                className='w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer relative z-10'
              >
                <RiDiscussLine className='w-4 h-4' />
                <span>{t('sidebar.needHelpBtn')}</span>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Top Toolbar */}
            <div className='bg-card border rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='text-xs font-semibold text-muted-foreground'>
                {isLoading
                  ? 'Đang tải...'
                  : `Hiển thị ${filteredTemplates.length} / ${templatesList.length} mẫu`}
              </div>

              <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
                {/* Search */}
                <form
                  onSubmit={handleSearchSubmit}
                  className='flex items-center border rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all flex-1 md:flex-initial'
                >
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t('search.placeholder')}
                    className='px-4 py-2 text-xs bg-transparent focus:outline-none w-full md:w-48 lg:w-56 font-medium text-foreground'
                  />
                  <button
                    type='submit'
                    className='px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/95 transition-all flex items-center gap-1 cursor-pointer'
                  >
                    <RiSearchLine className='w-3.5 h-3.5' />
                    <span className='hidden sm:inline'>{t('search.button')}</span>
                  </button>
                </form>

                {/* Sort */}
                <div className='flex items-center gap-2 border rounded-xl px-3 py-2 bg-background'>
                  <RiArrowUpDownLine className='w-3.5 h-3.5 text-muted-foreground' />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortType)}
                    className='text-xs font-bold text-foreground bg-transparent focus:outline-none cursor-pointer border-none p-0'
                  >
                    <option value='default'>{t('sort.default')}</option>
                    <option value='newest'>{t('sort.newest')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Template Grid */}
            {isLoading ? (
              <div className='flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground bg-card border rounded-3xl'>
                <RiLoader4Line className='w-8 h-8 animate-spin text-primary/50' />
                <p className='text-sm font-semibold'>Đang tải danh sách mẫu website...</p>
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredTemplates.map((theme, index) => {
                  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
                  return (
                    <div
                      key={theme.key}
                      className='group relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-300 flex flex-col h-[400px] animate-fade-in'
                    >
                      {/* Live scroll preview */}
                      <div className='relative border-b overflow-hidden flex-1'>
                        <WebsiteLivePreview
                          src={theme.demoPath}
                          thumbnailUrl={theme.thumbnailUrl}
                          alt={theme.titleVi || theme.key}
                          height={270}
                        />

                        {/* Hover overlay with action buttons (z above preview) */}
                        <div className='absolute inset-0 bg-slate-950/50 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-4 z-30'>
                          <button
                            onClick={scrollToContact}
                            className='w-36 py-2.5 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-md transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-slate-100 cursor-pointer'
                          >
                            {t('card.detail')}
                          </button>
                          <button
                            onClick={() => openPreview(theme.key)}
                            className='w-36 py-2.5 rounded-full bg-primary text-primary-foreground font-extrabold text-xs shadow-md transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary/95 flex items-center justify-center gap-1.5 cursor-pointer'
                          >
                            <span>{t('card.demo')}</span>
                            <RiExternalLinkLine className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className='p-5 space-y-2 bg-card relative z-10'>
                        <span
                          className={`text-4xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border w-fit block ${gradient.accent}`}
                        >
                          {getCategoryLabel(theme.category)}
                        </span>
                        <h3 className='text-sm font-black text-foreground group-hover:text-primary transition-colors line-clamp-1'>
                          {locale === 'vi'
                            ? theme.titleVi || theme.key
                            : theme.titleEn || theme.key}
                        </h3>
                        <p className='text-3xs text-muted-foreground leading-relaxed line-clamp-2'>
                          {locale === 'vi' ? theme.descVi || '' : theme.descEn || ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='bg-card border rounded-3xl p-16 text-center space-y-4'>
                <RiGlobalLine className='w-12 h-12 mx-auto text-muted-foreground/30' />
                <p className='text-sm font-semibold text-muted-foreground'>
                  {templatesList.length === 0
                    ? 'Chưa có mẫu website nào. Thêm mẫu trong trang Admin!'
                    : t('search.noResults')}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
