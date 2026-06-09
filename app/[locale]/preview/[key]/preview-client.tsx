'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RiCloseLine, RiTabletLine, RiTvLine, RiPhoneLine, RiLoader4Line } from '@remixicon/react';

import { logoDark } from '@/assets/images';
import { Link } from '@/i18n/navigation';
import { getTemplatesAction } from '@/app/[locale]/admin/actions';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function PreviewClient({ projectKey }: { projectKey: string }) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [demoPath, setDemoPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDemoPath() {
      try {
        setIsLoading(true);
        const dbData = await getTemplatesAction();
        const dbItem = dbData.find((d) => d.key === projectKey);
        if (dbItem?.demoPath) {
          setDemoPath(dbItem.demoPath);
        } else {
          setDemoPath(null);
        }
      } catch (err) {
        console.error('Failed to load demo path:', err);
        setDemoPath(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadDemoPath();
  }, [projectKey]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.close();
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-[#f8fafc]'>
      {/* Top Control Header Bar */}
      <div className='h-16 bg-[#0f172a] text-white flex items-center justify-between px-6 border-b border-slate-800/80 shadow-md relative z-30'>
        {/* Left side: Logo & Template Code */}
        <div className='flex items-center gap-3'>
          <Link href='/'>
            <Image
              src={logoDark}
              height={26}
              width={100}
              alt='Logo'
              priority
              className='object-contain'
            />
          </Link>
          <div className='border border-yellow-500/80 bg-yellow-500/10 text-yellow-500 font-extrabold px-3 py-1 rounded-full text-3xs uppercase tracking-wider hidden sm:inline-flex items-center justify-center'>
            MÃ GIAO DIỆN #{projectKey.toUpperCase()}
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className='flex items-center gap-3 bg-[#1e293b]/90 border border-slate-700/60 px-4 py-1.5 rounded-xl text-slate-300 text-xs font-semibold shadow-inner'>
          <div className='flex items-center gap-1.5 text-2xs text-slate-400 font-bold'>
            <RiTvLine className='w-4 h-4' />
            <span>Chọn thiết bị</span>
          </div>
          <div className='w-[1px] h-3 bg-slate-700/80 mx-1' />
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-[#0f172a] text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title='Desktop View'
            >
              <RiTvLine className='w-3.5 h-3.5' />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-[#0f172a] text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title='Tablet View'
            >
              <RiTabletLine className='w-3.5 h-3.5' />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-[#0f172a] text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title='Mobile View'
            >
              <RiPhoneLine className='w-3.5 h-3.5' />
            </button>
          </div>
        </div>

        {/* Right side: Close Button */}
        <div className='flex items-center gap-4'>
          <button
            onClick={handleClose}
            className='p-2 rounded-full hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors focus:outline-none'
            aria-label='Close preview'
          >
            <RiCloseLine className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Main Preview Work Area */}
      <div className='flex-1 bg-gradient-to-br from-[#f1f5f9] to-[#cbd5e1] p-6 md:p-8 flex items-center justify-center relative overflow-auto z-10'>
        {isLoading ? (
          <div className='flex flex-col items-center gap-4 text-slate-500'>
            <RiLoader4Line className='w-10 h-10 animate-spin text-slate-400' />
            <p className='text-sm font-semibold'>Đang tải bản xem thử...</p>
          </div>
        ) : !demoPath ? (
          <div className='flex flex-col items-center gap-4 text-slate-500 text-center'>
            <div className='text-5xl'>🔗</div>
            <p className='text-base font-bold text-slate-600'>Chưa có link demo</p>
            <p className='text-sm text-slate-500 max-w-xs'>
              Vào trang Admin để gán link demo cho mẫu website này.
            </p>
          </div>
        ) : (
          <div
            className={`transition-all duration-500 bg-white relative ${
              deviceMode === 'mobile'
                ? 'aspect-[9/19] h-[80vh] max-h-[820px] w-auto border-[12px] border-[#0f172a] rounded-[45px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] overflow-hidden'
                : deviceMode === 'tablet'
                  ? 'aspect-[3/4] h-[82vh] max-h-[920px] w-auto border-[14px] border-[#0f172a] rounded-[30px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] overflow-hidden'
                  : 'w-full h-full rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden'
            }`}
          >
            {/* Simulated Mobile Notch */}
            {deviceMode === 'mobile' && (
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-[#0f172a] rounded-b-xl z-20 flex items-center justify-center shadow-inner'>
                <span className='w-2 h-2 rounded-full bg-slate-800/80 border border-slate-700/50 mr-12' />
                <span className='w-1 h-1 rounded-full bg-slate-900' />
              </div>
            )}

            {/* Live Preview Iframe */}
            <iframe
              src={demoPath}
              className='w-full h-full border-none'
              title='Live Demo Preview'
              loading='lazy'
            />
          </div>
        )}
      </div>
    </div>
  );
}
