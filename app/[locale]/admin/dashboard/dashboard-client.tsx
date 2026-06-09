'use client';

import { useState, useTransition, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiExternalLinkLine,
  RiEditLine,
  RiLogoutBoxRLine,
  RiUploadCloud2Line,
  RiLoader4Line,
  RiCloseLine,
  RiGlobalLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiAddLine,
  RiCheckLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiImageLine,
  RiLink,
  RiTranslate2,
  RiDragMove2Line,
  RiShoppingBag3Line,
  RiServiceLine,
  RiBriefcaseLine,
  RiFileTextLine,
  RiMegaphoneLine,
  RiLayoutLine,
} from '@remixicon/react';
import {
  saveTemplateAction,
  uploadThumbnailAction,
  logoutAdmin,
  createTemplateAction,
  deleteTemplateAction,
} from '../actions';
import { TemplateData } from '@/lib/db';
import WebsiteLivePreview from '@/components/shared/website-live-preview';

interface DashboardClientProps {
  initialTemplates: TemplateData[];
}

// ─── Category config ────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  sales: {
    label: 'Bán hàng',
    color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    icon: <RiShoppingBag3Line className='w-4 h-4' />,
  },
  services: {
    label: 'Dịch vụ',
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    icon: <RiServiceLine className='w-4 h-4' />,
  },
  intro: {
    label: 'Giới thiệu',
    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: <RiBriefcaseLine className='w-4 h-4' />,
  },
  landing: {
    label: 'Landing Page',
    color: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    icon: <RiFileTextLine className='w-4 h-4' />,
  },
  web: {
    label: 'Thiết kế Web',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    icon: <RiLayoutLine className='w-4 h-4' />,
  },
  marketing: {
    label: 'Marketing',
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    icon: <RiMegaphoneLine className='w-4 h-4' />,
  },
};

const getCatConfig = (cat: string) =>
  CATEGORY_CONFIG[cat] ?? {
    label: cat,
    color: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    icon: <RiGlobalLine className='w-4 h-4' />,
  };

// ─── Wizard Steps ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Thông tin cơ bản', icon: <RiLink className='w-4 h-4' /> },
  { id: 2, label: 'Tên & Mô tả', icon: <RiTranslate2 className='w-4 h-4' /> },
  { id: 3, label: 'Ảnh đại diện', icon: <RiImageLine className='w-4 h-4' /> },
];

// ─── Drag-drop thumbnail uploader ────────────────────────────────────────────
function ThumbnailUploader({
  thumbnailUrl,
  onUrlChange,
  isUploading,
  uploadError,
  onFileSelect,
  inputId,
}: {
  thumbnailUrl: string | null;
  onUrlChange: (url: string | null) => void;
  isUploading: boolean;
  uploadError: string | null;
  onFileSelect: (file: File) => void;
  inputId: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className='space-y-4'>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !thumbnailUrl && inputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
          thumbnailUrl
            ? 'border-transparent cursor-default'
            : isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-slate-700 hover:border-primary/50 hover:bg-slate-900/60 cursor-pointer'
        }`}
      >
        {thumbnailUrl ? (
          /* Preview */
          <div className='relative group'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt='Thumbnail preview'
              className='w-full h-52 object-cover object-top'
            />
            {/* Hover scroll effect */}
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            {/* Actions overlay */}
            <div className='absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 backdrop-blur-xs'>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                disabled={isUploading}
                className='px-4 py-2 bg-white text-slate-900 text-xs font-extrabold rounded-xl shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer'
              >
                <RiUploadCloud2Line className='w-4 h-4' />
                Đổi ảnh
              </button>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onUrlChange(null);
                }}
                disabled={isUploading}
                className='px-4 py-2 bg-red-500/90 text-white text-xs font-extrabold rounded-xl shadow-lg hover:bg-red-500 transition-colors flex items-center gap-1.5 cursor-pointer'
              >
                <RiDeleteBinLine className='w-4 h-4' />
                Xoá ảnh
              </button>
            </div>
            {/* Success badge */}
            <div className='absolute top-3 left-3 bg-emerald-500 text-white text-3xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1'>
              <RiCheckLine className='w-3 h-3' />
              Đã upload
            </div>
          </div>
        ) : (
          /* Empty zone */
          <div className='h-52 flex flex-col items-center justify-center gap-4 p-8 text-center'>
            {isUploading ? (
              <>
                <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center'>
                  <RiLoader4Line className='w-7 h-7 text-primary animate-spin' />
                </div>
                <div>
                  <p className='text-sm font-bold text-white'>Đang tải lên...</p>
                  <p className='text-xs text-slate-500 mt-1'>Vui lòng chờ</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? 'bg-primary/20 scale-110' : 'bg-slate-800'}`}
                >
                  <RiDragMove2Line
                    className={`w-7 h-7 transition-colors ${isDragging ? 'text-primary' : 'text-slate-500'}`}
                  />
                </div>
                <div>
                  <p className='text-sm font-bold text-white'>
                    {isDragging ? 'Thả ảnh vào đây!' : 'Kéo thả ảnh vào đây'}
                  </p>
                  <p className='text-xs text-slate-500 mt-1'>hoặc click để chọn từ máy tính</p>
                  <p className='text-3xs text-slate-600 mt-2'>PNG, JPG, WEBP · Tối đa 5MB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL input alternative */}
      {!thumbnailUrl && !isUploading && (
        <div className='flex items-center gap-3'>
          <div className='flex-1 h-[1px] bg-slate-800' />
          <span className='text-3xs text-slate-600 font-bold'>HOẶC NHẬP URL</span>
          <div className='flex-1 h-[1px] bg-slate-800' />
        </div>
      )}
      {!thumbnailUrl && !isUploading && (
        <input
          type='url'
          placeholder='https://example.com/thumbnail.jpg'
          onBlur={(e) => {
            if (e.target.value.startsWith('http')) onUrlChange(e.target.value);
          }}
          className='w-full py-3 px-4 bg-slate-950/40 border border-slate-800 focus:border-primary/50 text-xs text-white placeholder-slate-700 rounded-xl focus:outline-none transition-all'
        />
      )}

      {uploadError && (
        <div className='flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3'>
          <span>⚠️</span>
          <span>{uploadError}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type='file'
        id={inputId}
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />
    </div>
  );
}

// ─── Category Selector ───────────────────────────────────────────────────────
function CategorySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
      {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
        <button
          key={key}
          type='button'
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            value === key
              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
          }`}
        >
          {cfg.icon}
          <span>{cfg.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DashboardClient({ initialTemplates }: DashboardClientProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateData[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | string>('all');

  // ── Edit modal state ──
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  const [editCategory, setEditCategory] = useState<string>('sales');
  const [editDemoPath, setEditDemoPath] = useState('');
  const [editThumbnailUrl, setEditThumbnailUrl] = useState<string | null>(null);
  const [editTitleVi, setEditTitleVi] = useState<string>('');
  const [editTitleEn, setEditTitleEn] = useState<string>('');
  const [editDescVi, setEditDescVi] = useState<string>('');
  const [editDescEn, setEditDescEn] = useState<string>('');
  const [editLangTab, setEditLangTab] = useState<'vi' | 'en'>('vi');

  // ── Create wizard state ──
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newKey, setNewKey] = useState('');
  const [newCategory, setNewCategory] = useState('sales');
  const [newDemoPath, setNewDemoPath] = useState('');
  const [newThumbnailUrl, setNewThumbnailUrl] = useState<string | null>(null);
  const [newTitleVi, setNewTitleVi] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newDescVi, setNewDescVi] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newLangTab, setNewLangTab] = useState<'vi' | 'en'>('vi');

  // ── Upload state ──
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // ── Derived data ──
  const categories = useMemo(() => {
    const cats = new Set(templates.map((t) => t.category));
    Object.keys(CATEGORY_CONFIG).forEach((c) => cats.add(c));
    return ['all', ...Array.from(cats)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.demoPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.titleVi && t.titleVi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.titleEn && t.titleEn.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategoryFilter === 'all' || t.category === activeCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, activeCategoryFilter]);

  // ── Auth ──
  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
    router.push('/admin/login');
  };

  // ── Upload helper ──
  const handleFileUpload = async (file: File, type: 'new' | 'edit') => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      const res = await uploadThumbnailAction(formData);
      if (res.success && res.url) {
        if (type === 'new') setNewThumbnailUrl(res.url);
        else setEditThumbnailUrl(res.url);
      } else {
        setUploadError(res.error || 'Tải ảnh lên thất bại');
      }
    } catch {
      setUploadError('Có lỗi xảy ra khi upload tệp');
    } finally {
      setIsUploading(false);
    }
  };

  // ── Edit ──
  const openEditModal = (template: TemplateData) => {
    setEditingTemplate(template);
    setEditCategory(template.category);
    setEditDemoPath(template.demoPath);
    setEditThumbnailUrl(template.thumbnailUrl);
    setEditTitleVi(template.titleVi || '');
    setEditTitleEn(template.titleEn || '');
    setEditDescVi(template.descVi || '');
    setEditDescEn(template.descEn || '');
    setEditLangTab('vi');
    setUploadError(null);
  };

  const closeEditModal = () => setEditingTemplate(null);

  const handleSave = () => {
    if (!editingTemplate) return;
    startTransition(async () => {
      const res = await saveTemplateAction(
        editingTemplate.key,
        editDemoPath,
        editThumbnailUrl,
        editTitleVi || null,
        editTitleEn || null,
        editDescVi || null,
        editDescEn || null,
        editCategory,
      );
      if (res.success) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.key === editingTemplate.key
              ? {
                  ...t,
                  category: editCategory,
                  demoPath: editDemoPath,
                  thumbnailUrl: editThumbnailUrl,
                  titleVi: editTitleVi || null,
                  titleEn: editTitleEn || null,
                  descVi: editDescVi || null,
                  descEn: editDescEn || null,
                }
              : t,
          ),
        );
        closeEditModal();
        router.refresh();
      } else {
        alert(res.error || 'Lưu thay đổi thất bại');
      }
    });
  };

  // ── Create wizard ──
  const openCreateModal = () => {
    setNewKey('');
    setNewCategory('sales');
    setNewDemoPath('');
    setNewThumbnailUrl(null);
    setNewTitleVi('');
    setNewTitleEn('');
    setNewDescVi('');
    setNewDescEn('');
    setNewLangTab('vi');
    setUploadError(null);
    setWizardStep(1);
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => setIsCreateOpen(false);

  const canGoNextStep1 = newKey.trim() !== '' && newDemoPath.trim() !== '';

  const handleCreate = () => {
    if (!newKey || !newDemoPath) return;
    const newTemplate: TemplateData = {
      key: newKey.toLowerCase().trim(),
      category: newCategory,
      demoPath: newDemoPath.trim(),
      thumbnailUrl: newThumbnailUrl,
      titleVi: newTitleVi.trim() || null,
      titleEn: newTitleEn.trim() || null,
      descVi: newDescVi.trim() || null,
      descEn: newDescEn.trim() || null,
    };
    startTransition(async () => {
      const res = await createTemplateAction(newTemplate);
      if (res.success) {
        setTemplates((prev) => [...prev, newTemplate]);
        closeCreateModal();
        router.refresh();
      } else {
        alert(res.error || 'Thêm mẫu website mới thất bại');
      }
    });
  };

  // ── Delete ──
  const handleDelete = (key: string) => {
    if (!window.confirm(`Xóa mẫu "${key.toUpperCase()}"? Không thể hoàn tác!`)) return;
    startTransition(async () => {
      const res = await deleteTemplateAction(key);
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t.key !== key));
        router.refresh();
      } else {
        alert(res.error || 'Xóa thất bại');
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  const isModalOpen = !!(isCreateOpen || editingTemplate);

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10'>
      {/* Main dashboard content, hidden when a modal is open to avoid rendering lag */}
      <div
        className={`space-y-8 transition-all duration-200 ${isModalOpen ? 'invisible pointer-events-none' : ''}`}
      >
        {/* ── Top Navbar ── */}
        <div className='flex items-center justify-between bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-lg'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-lg font-black shadow-lg'>
              K
            </div>
            <div>
              <h1 className='text-lg font-bold text-white leading-tight'>Katalin Admin</h1>
              <p className='text-3xs text-slate-400 uppercase tracking-widest font-extrabold'>
                Mẫu Website & Portfolio
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='px-4 py-2 border border-red-500/30 bg-red-500/5 hover:bg-red-500/15 text-red-400 hover:text-red-300 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all'
          >
            <RiLogoutBoxRLine className='w-4 h-4' />
            Đăng xuất
          </button>
        </div>

        {/* ── Stats Cards ── */}
        <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4'>
          {[
            { label: 'Tổng số website', value: templates.length, color: 'text-white' },
            {
              label: 'Có Thumbnail',
              value: templates.filter((t) => t.thumbnailUrl).length,
              color: 'text-primary',
            },
            {
              label: 'Giao diện (Theme)',
              value: templates.filter((t) => t.key.startsWith('theme')).length,
              color: 'text-amber-400',
            },
            {
              label: 'Dự án (Project)',
              value: templates.filter((t) => t.key.startsWith('proj')).length,
              color: 'text-emerald-400',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className='bg-slate-900/40 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1'
            >
              <span className='text-3xs font-bold text-slate-400 uppercase tracking-wider block'>
                {stat.label}
              </span>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
          <div className='bg-slate-900/40 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1 col-span-2 sm:col-span-1'>
            <span className='text-3xs font-bold text-slate-400 uppercase tracking-wider block'>
              Lưu trữ
            </span>
            <span className='text-xs font-extrabold text-white flex items-center gap-1.5 pt-1.5'>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <>
                  <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse' />
                  Supabase Cloud
                </>
              ) : (
                <>
                  <span className='w-2.5 h-2.5 rounded-full bg-amber-500' />
                  Local JSON
                </>
              )}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className='bg-slate-900/40 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4'>
          {/* Search */}
          <div className='relative flex-1 max-w-md'>
            <RiSearchLine className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Tìm theo mã, tên hoặc link demo...'
              className='w-full py-2.5 pl-10.5 pr-4 bg-slate-950/40 border border-slate-800 focus:border-primary/50 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all'
            />
          </div>

          <div className='flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end'>
            {/* Category Tabs */}
            <div className='flex flex-wrap gap-1.5'>
              {categories.map((cat) => {
                const cfg = getCatConfig(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      activeCategoryFilter === cat
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-slate-950/30 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả' : cfg.label}
                  </button>
                );
              })}
            </div>
            <div className='h-6 w-px bg-slate-800 hidden sm:block' />
            {/* Add button */}
            <button
              onClick={openCreateModal}
              className='px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-950/30 flex items-center gap-2 cursor-pointer transition-all'
            >
              <RiAddLine className='w-4.5 h-4.5' />
              Thêm website mẫu
            </button>
          </div>
        </div>

        {/* ── Template Grid ── */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTemplates.map((template) => {
            const cfg = getCatConfig(template.category);
            return (
              <div
                key={template.key}
                className='bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-md flex flex-col hover:border-slate-700 transition-all group'
              >
                {/* Live scroll preview */}
                <div className='relative border-b border-slate-800 overflow-hidden'>
                  <WebsiteLivePreview
                    src={template.demoPath}
                    thumbnailUrl={template.thumbnailUrl}
                    alt={template.key}
                    height={180}
                    active={!isModalOpen}
                  />
                  <span
                    className={`absolute top-3 left-3 z-20 border rounded-full px-2.5 py-1 text-4xs font-extrabold uppercase tracking-wider flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm ${cfg.color}`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  <span className='absolute top-3 right-3 z-20 bg-slate-900/80 text-slate-300 font-mono text-3xs font-bold px-2 py-1 rounded-md border border-slate-700 backdrop-blur-sm'>
                    {template.key.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className='p-5 flex-1 flex flex-col justify-between gap-4'>
                  <div className='space-y-2.5'>
                    <div>
                      <h3 className='text-sm font-bold text-white line-clamp-1'>
                        {template.titleVi || `[Code] ${template.key}`}
                      </h3>
                      <p className='text-xs text-slate-400 line-clamp-1 italic'>
                        {template.titleEn || 'Chưa có tên tiếng Anh'}
                      </p>
                    </div>
                    <div className='flex items-center gap-1.5 text-3xs text-slate-400 font-mono bg-slate-950/30 border border-slate-800/50 px-3 py-1.5 rounded-lg'>
                      <RiLink className='w-3 h-3 flex-shrink-0' />
                      <span className='line-clamp-1 select-all'>{template.demoPath}</span>
                    </div>
                  </div>

                  <div className='flex gap-2 pt-3 border-t border-slate-800'>
                    <button
                      onClick={() => openEditModal(template)}
                      className='flex-1 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer'
                    >
                      <RiEditLine className='w-4 h-4' />
                      Chỉnh sửa
                    </button>
                    <a
                      href={template.demoPath}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/50 transition-all flex items-center justify-center cursor-pointer'
                      title='Mở link demo'
                    >
                      <RiExternalLinkLine className='w-4 h-4' />
                    </a>
                    <button
                      onClick={() => handleDelete(template.key)}
                      className='px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex items-center justify-center cursor-pointer'
                      title='Xóa'
                    >
                      <RiDeleteBinLine className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className='col-span-full py-20 text-center text-slate-500 space-y-3 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10'>
              <RiGlobalLine className='w-12 h-12 mx-auto text-slate-700' />
              <p className='text-sm font-semibold'>Không tìm thấy mẫu website nào</p>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CREATE WIZARD MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {isCreateOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95'>
          <div className='w-full max-w-2xl bg-[#0f1728] border border-slate-800 rounded-3xl shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]'>
            {/* Wizard Header */}
            <div className='px-8 pt-8 pb-6 border-b border-slate-800/80 flex-shrink-0'>
              <div className='flex items-start justify-between mb-6'>
                <div>
                  <h2 className='text-xl font-black text-white'>Thêm website mẫu mới</h2>
                  <p className='text-xs text-slate-500 mt-1'>
                    Bước {wizardStep} / {STEPS.length} — {STEPS[wizardStep - 1].label}
                  </p>
                </div>
                <button
                  onClick={closeCreateModal}
                  className='p-2 rounded-full hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer flex-shrink-0'
                >
                  <RiCloseLine className='w-5 h-5' />
                </button>
              </div>

              {/* Step Progress Bar */}
              <div className='flex items-center gap-2'>
                {STEPS.map((step, i) => (
                  <div key={step.id} className='flex items-center gap-2 flex-1'>
                    <div className='flex flex-col items-center gap-1.5 w-full'>
                      <div className={`w-full relative flex items-center justify-center`}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all duration-500 z-10 ${
                            wizardStep > step.id
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : wizardStep === step.id
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-slate-900 border-slate-700 text-slate-500'
                          }`}
                        >
                          {wizardStep > step.id ? <RiCheckLine className='w-4 h-4' /> : step.icon}
                        </div>
                      </div>
                      <span
                        className={`text-3xs font-bold whitespace-nowrap ${
                          wizardStep === step.id ? 'text-primary' : 'text-slate-600'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mb-5 transition-all duration-500 ${
                          wizardStep > step.id ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className='flex-1 overflow-y-auto px-8 py-7'>
              {/* ── Step 1: Thông tin cơ bản ── */}
              {wizardStep === 1 && (
                <div className='space-y-6'>
                  {/* Key */}
                  <div className='space-y-2'>
                    <label className='text-xs font-extrabold text-slate-300 flex items-center gap-2'>
                      <span className='w-5 h-5 rounded-md bg-primary/20 text-primary text-3xs font-black flex items-center justify-center'>
                        1
                      </span>
                      Mã định danh (Key) <span className='text-red-400'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder='Ví dụ: theme7, landing-spa, proj4'
                        className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono'
                      />
                      {newKey && !/^[a-zA-Z0-9_-]+$/.test(newKey) && (
                        <p className='text-xs text-red-400 mt-1.5 flex items-center gap-1'>
                          ⚠️ Chỉ dùng chữ cái, số, gạch ngang (-) và gạch dưới (_)
                        </p>
                      )}
                    </div>
                    <p className='text-3xs text-slate-600'>
                      Mã này sẽ là đường dẫn preview:{' '}
                      <span className='text-slate-400 font-mono'>
                        /preview/<span className='text-primary'>{newKey || 'key'}</span>
                      </span>
                    </p>
                  </div>

                  {/* Demo Link */}
                  <div className='space-y-2'>
                    <label className='text-xs font-extrabold text-slate-300 flex items-center gap-2'>
                      <span className='w-5 h-5 rounded-md bg-primary/20 text-primary text-3xs font-black flex items-center justify-center'>
                        2
                      </span>
                      Link website demo <span className='text-red-400'>*</span>
                    </label>
                    <input
                      type='url'
                      value={newDemoPath}
                      onChange={(e) => setNewDemoPath(e.target.value)}
                      placeholder='https://example.com/your-template'
                      className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all'
                    />
                    {/* URL Live Preview */}
                    {newDemoPath.startsWith('http') && (
                      <div className='mt-3 rounded-xl border border-slate-800 overflow-hidden'>
                        <div className='bg-slate-900 px-4 py-2.5 flex items-center gap-2 border-b border-slate-800'>
                          <div className='flex gap-1.5'>
                            <span className='w-2.5 h-2.5 rounded-full bg-red-500/70' />
                            <span className='w-2.5 h-2.5 rounded-full bg-yellow-500/70' />
                            <span className='w-2.5 h-2.5 rounded-full bg-green-500/70' />
                          </div>
                          <span className='flex-1 text-center text-3xs text-slate-500 font-mono truncate'>
                            {newDemoPath}
                          </span>
                        </div>
                        <iframe
                          src={newDemoPath}
                          className='w-full h-48 border-none bg-white'
                          title='URL Preview'
                          loading='lazy'
                          sandbox='allow-scripts allow-same-origin'
                        />
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className='space-y-3'>
                    <label className='text-xs font-extrabold text-slate-300 flex items-center gap-2'>
                      <span className='w-5 h-5 rounded-md bg-primary/20 text-primary text-3xs font-black flex items-center justify-center'>
                        3
                      </span>
                      Danh mục ngành nghề
                    </label>
                    <CategorySelector value={newCategory} onChange={setNewCategory} />
                  </div>
                </div>
              )}

              {/* ── Step 2: Tên & Mô tả ── */}
              {wizardStep === 2 && (
                <div className='space-y-5'>
                  <div className='bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-3'>
                    <RiTranslate2 className='w-5 h-5 text-primary flex-shrink-0' />
                    <span>
                      Nhập tên và mô tả cho cả <strong className='text-white'>Tiếng Việt</strong> và{' '}
                      <strong className='text-white'>Tiếng Anh</strong> để website hiển thị đúng
                      theo ngôn ngữ.
                    </span>
                  </div>

                  {/* Language Tabs */}
                  <div className='flex gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5'>
                    {(['vi', 'en'] as const).map((lang) => (
                      <button
                        key={lang}
                        type='button'
                        onClick={() => setNewLangTab(lang)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          newLangTab === lang
                            ? 'bg-primary text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
                      </button>
                    ))}
                  </div>

                  {newLangTab === 'vi' ? (
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <label className='text-xs font-extrabold text-slate-400 block'>
                          Tiêu đề (Tiếng Việt)
                        </label>
                        <input
                          type='text'
                          value={newTitleVi}
                          onChange={(e) => setNewTitleVi(e.target.value)}
                          placeholder='Ví dụ: Website Bán Hàng Thời Trang'
                          className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-xs font-extrabold text-slate-400 block'>
                          Mô tả ngắn (Tiếng Việt)
                        </label>
                        <textarea
                          value={newDescVi}
                          onChange={(e) => setNewDescVi(e.target.value)}
                          placeholder='Mô tả tính năng nổi bật của giao diện này...'
                          rows={4}
                          className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all resize-none'
                        />
                        <p className='text-3xs text-slate-600 text-right'>
                          {newDescVi.length}/200 ký tự
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <label className='text-xs font-extrabold text-slate-400 block'>
                          Title (English)
                        </label>
                        <input
                          type='text'
                          value={newTitleEn}
                          onChange={(e) => setNewTitleEn(e.target.value)}
                          placeholder='E.g., Fashion E-Commerce Theme'
                          className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-xs font-extrabold text-slate-400 block'>
                          Short Description (English)
                        </label>
                        <textarea
                          value={newDescEn}
                          onChange={(e) => setNewDescEn(e.target.value)}
                          placeholder='Describe the key features of this template...'
                          rows={4}
                          className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all resize-none'
                        />
                        <p className='text-3xs text-slate-600 text-right'>
                          {newDescEn.length}/200 chars
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 3: Thumbnail ── */}
              {wizardStep === 3 && (
                <div className='space-y-5'>
                  <div className='bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-3'>
                    <RiImageLine className='w-5 h-5 text-primary flex-shrink-0' />
                    <span>
                      Ảnh đại diện giúp người dùng nhận biết giao diện trước khi xem demo. Hỗ trợ{' '}
                      <strong className='text-white'>kéo thả</strong> trực tiếp.
                    </span>
                  </div>
                  <ThumbnailUploader
                    thumbnailUrl={newThumbnailUrl}
                    onUrlChange={setNewThumbnailUrl}
                    isUploading={isUploading}
                    uploadError={uploadError}
                    onFileSelect={(file) => handleFileUpload(file, 'new')}
                    inputId='create-thumbnail'
                  />

                  {/* Summary card */}
                  <div className='bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3'>
                    <p className='text-xs font-extrabold text-slate-400 uppercase tracking-wider'>
                      Tóm tắt thông tin
                    </p>
                    <div className='space-y-2 text-xs'>
                      <div className='flex items-center justify-between'>
                        <span className='text-slate-500'>Mã Key</span>
                        <span className='text-white font-mono font-bold'>{newKey || '—'}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-slate-500'>Danh mục</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full border text-3xs ${getCatConfig(newCategory).color}`}
                        >
                          {getCatConfig(newCategory).label}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-slate-500'>Link demo</span>
                        <a
                          href={newDemoPath}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary hover:underline truncate max-w-[200px]'
                        >
                          {newDemoPath || '—'}
                        </a>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-slate-500'>Tên (VI)</span>
                        <span className='text-slate-300'>{newTitleVi || '—'}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-slate-500'>Thumbnail</span>
                        <span
                          className={
                            newThumbnailUrl ? 'text-emerald-400 font-bold' : 'text-slate-500'
                          }
                        >
                          {newThumbnailUrl ? '✅ Đã chọn' : 'Chưa có (bỏ qua được)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Footer */}
            <div className='px-8 pb-7 pt-5 border-t border-slate-800/80 flex-shrink-0'>
              <div className='flex gap-3'>
                {wizardStep > 1 ? (
                  <button
                    type='button'
                    onClick={() => setWizardStep((s) => s - 1)}
                    disabled={isPending}
                    className='px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2'
                  >
                    <RiArrowLeftLine className='w-4 h-4' />
                    Quay lại
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={closeCreateModal}
                    disabled={isPending}
                    className='px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-extrabold rounded-xl transition-all cursor-pointer'
                  >
                    Hủy
                  </button>
                )}

                {wizardStep < STEPS.length ? (
                  <button
                    type='button'
                    onClick={() => setWizardStep((s) => s + 1)}
                    disabled={wizardStep === 1 && !canGoNextStep1}
                    className='flex-1 py-3 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2'
                  >
                    Tiếp theo
                    <RiArrowRightLine className='w-4 h-4' />
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={handleCreate}
                    disabled={isPending || isUploading || !canGoNextStep1}
                    className='flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-950/30 transition-all cursor-pointer flex items-center justify-center gap-2'
                  >
                    {isPending ? (
                      <>
                        <RiLoader4Line className='w-4 h-4 animate-spin' />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <RiCheckLine className='w-4 h-4' />
                        Tạo website mẫu
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          EDIT MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {editingTemplate && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95'>
          <div className='w-full max-w-2xl bg-[#0f1728] border border-slate-800 rounded-3xl shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]'>
            {/* Edit Header */}
            <div className='px-8 pt-7 pb-5 border-b border-slate-800/80 flex-shrink-0 flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-black text-white flex items-center gap-2.5'>
                  Chỉnh sửa website
                  <span className='bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold px-2.5 py-1 rounded-lg'>
                    {editingTemplate.key.toUpperCase()}
                  </span>
                </h2>
                <p className='text-xs text-slate-500 mt-1'>
                  Danh mục:{' '}
                  <span className='text-slate-300'>
                    {getCatConfig(editingTemplate.category).label}
                  </span>
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className='p-2 rounded-full hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer'
              >
                <RiCloseLine className='w-5 h-5' />
              </button>
            </div>

            {/* Edit Form */}
            <div className='flex-1 overflow-y-auto px-8 py-6 space-y-6'>
              {/* Category */}
              <div className='space-y-3'>
                <label className='text-xs font-extrabold text-slate-300 flex items-center gap-2'>
                  <RiLayoutLine className='w-4 h-4 text-primary' />
                  Danh mục
                </label>
                <CategorySelector value={editCategory} onChange={setEditCategory} />
              </div>

              {/* Demo Link */}
              <div className='space-y-2'>
                <label className='text-xs font-extrabold text-slate-300 flex items-center gap-2'>
                  <RiLink className='w-4 h-4 text-primary' />
                  Link website demo
                </label>
                <input
                  type='url'
                  value={editDemoPath}
                  onChange={(e) => setEditDemoPath(e.target.value)}
                  placeholder='https://...'
                  disabled={isPending}
                  className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all'
                />
              </div>

              {/* Language Tabs for Title/Desc */}
              <div className='space-y-4'>
                <label className='text-xs font-extrabold text-slate-300 flex items-center gap-2'>
                  <RiTranslate2 className='w-4 h-4 text-primary' />
                  Tên & Mô tả đa ngôn ngữ
                </label>
                <div className='flex gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5'>
                  {(['vi', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type='button'
                      onClick={() => setEditLangTab(lang)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        editLangTab === lang
                          ? 'bg-primary text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
                    </button>
                  ))}
                </div>

                {editLangTab === 'vi' ? (
                  <div className='space-y-4'>
                    <input
                      type='text'
                      value={editTitleVi}
                      onChange={(e) => setEditTitleVi(e.target.value)}
                      placeholder='Tiêu đề tiếng Việt...'
                      disabled={isPending}
                      className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all'
                    />
                    <textarea
                      value={editDescVi}
                      onChange={(e) => setEditDescVi(e.target.value)}
                      placeholder='Mô tả ngắn tiếng Việt...'
                      disabled={isPending}
                      rows={3}
                      className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all resize-none'
                    />
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <input
                      type='text'
                      value={editTitleEn}
                      onChange={(e) => setEditTitleEn(e.target.value)}
                      placeholder='English title...'
                      disabled={isPending}
                      className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all'
                    />
                    <textarea
                      value={editDescEn}
                      onChange={(e) => setEditDescEn(e.target.value)}
                      placeholder='Short description in English...'
                      disabled={isPending}
                      rows={3}
                      className='w-full py-3.5 px-4 bg-slate-900/60 border border-slate-700 focus:border-primary/60 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all resize-none'
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              <div className='space-y-2'>
                <label className='text-xs font-extrabold text-slate-300 flex items-center gap-2'>
                  <RiImageLine className='w-4 h-4 text-primary' />
                  Ảnh đại diện (Thumbnail)
                </label>
                <ThumbnailUploader
                  thumbnailUrl={editThumbnailUrl}
                  onUrlChange={setEditThumbnailUrl}
                  isUploading={isUploading}
                  uploadError={uploadError}
                  onFileSelect={(file) => handleFileUpload(file, 'edit')}
                  inputId='edit-thumbnail'
                />
              </div>
            </div>

            {/* Edit Footer */}
            <div className='px-8 pb-7 pt-5 border-t border-slate-800/80 flex-shrink-0'>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={closeEditModal}
                  disabled={isPending || isUploading}
                  className='px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-extrabold rounded-xl transition-all cursor-pointer'
                >
                  Hủy
                </button>
                <button
                  type='button'
                  onClick={handleSave}
                  disabled={isPending || isUploading}
                  className='flex-1 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer'
                >
                  {isPending ? (
                    <>
                      <RiLoader4Line className='w-4 h-4 animate-spin' />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <RiCheckLine className='w-4 h-4' />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
