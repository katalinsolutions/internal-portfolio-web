'use client';

import { useState } from 'react';
import { RiPhoneLine, RiMessengerLine } from '@remixicon/react';
import { CONTACT_CONFIG } from '@/lib/config';

interface FloatingContactProps {
  hotline?: string;
  zaloId?: string;
  messengerId?: string;
}

export default function FloatingContact({
  hotline = CONTACT_CONFIG.hotline,
  zaloId = CONTACT_CONFIG.zaloId,
  messengerId = CONTACT_CONFIG.messengerId,
}: FloatingContactProps) {
  const [hoveredButton, setHoveredButton] = useState<'phone' | 'zalo' | 'messenger' | null>(null);

  const formattedPhone = hotline.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

  return (
    <div className='fixed bottom-6 right-6 z-40 flex flex-col gap-3.5 select-none'>
      {/* 1. Hotline Button */}
      <div className='relative flex items-center justify-end group'>
        {/* Tooltip */}
        <span
          className={`absolute right-14 bg-emerald-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-lg border border-emerald-400/20 whitespace-nowrap transition-all duration-300 pointer-events-none ${
            hoveredButton === 'phone' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          Hotline: {formattedPhone}
        </span>

        {/* Pulse Rings */}
        <span className='absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none scale-125' />
        <span className='absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse pointer-events-none scale-150' />

        <a
          href={`tel:${hotline}`}
          onMouseEnter={() => setHoveredButton('phone')}
          onMouseLeave={() => setHoveredButton(null)}
          className='w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(16,185,129,0.5)] border border-emerald-400/20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative z-10'
          aria-label='Call Hotline'
        >
          <RiPhoneLine className='w-5.5 h-5.5 animate-bounce' />
        </a>
      </div>

      {/* 2. Zalo Button */}
      <div className='relative flex items-center justify-end group'>
        {/* Tooltip */}
        <span
          className={`absolute right-14 bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-lg border border-blue-500/20 whitespace-nowrap transition-all duration-300 pointer-events-none ${
            hoveredButton === 'zalo' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          Chat Zalo
        </span>

        <a
          href={`https://zalo.me/${zaloId}`}
          target='_blank'
          rel='noopener noreferrer'
          onMouseEnter={() => setHoveredButton('zalo')}
          onMouseLeave={() => setHoveredButton(null)}
          className='w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_-4px_rgba(41,98,255,0.4)] border border-slate-200/60 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative z-10'
          aria-label='Chat on Zalo'
        >
          <svg viewBox='0 0 48 48' className='w-9.5 h-9.5' xmlns='http://www.w3.org/2000/svg'>
            <path
              fill='#2962ff'
              d='M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10c4.722,0,8.883-2.348,11.417-5.931V36H15z'
            />
            <path
              fill='#eee'
              d='M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z'
            />
            <path
              fill='#2962ff'
              d='M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z'
            />
            <path fill='#2962ff' d='M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z' />
            <path
              fill='#2962ff'
              d='M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z'
            />
            <path
              fill='#2962ff'
              d='M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z'
            />
          </svg>
        </a>
      </div>

      {/* 3. Facebook Messenger Button */}
      <div className='relative flex items-center justify-end group'>
        {/* Tooltip */}
        <span
          className={`absolute right-14 bg-purple-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-lg border border-purple-500/20 whitespace-nowrap transition-all duration-300 pointer-events-none ${
            hoveredButton === 'messenger' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          Messenger
        </span>

        <a
          href={`https://m.me/${messengerId}`}
          target='_blank'
          rel='noopener noreferrer'
          onMouseEnter={() => setHoveredButton('messenger')}
          onMouseLeave={() => setHoveredButton(null)}
          className='w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 hover:opacity-95 text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(168,85,247,0.5)] border border-pink-400/20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative z-10'
          aria-label='Chat on Messenger'
        >
          <RiMessengerLine className='w-5.5 h-5.5' />
        </a>
      </div>
    </div>
  );
}
