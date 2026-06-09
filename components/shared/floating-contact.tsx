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
          className='w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(59,130,246,0.5)] border border-blue-400/20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative z-10'
          aria-label='Chat on Zalo'
        >
          {/* Authentic-looking Zalo Text Icon */}
          <span className='font-black text-3xs tracking-tighter uppercase select-none'>Zalo</span>
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
