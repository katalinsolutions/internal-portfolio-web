'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiLoader4Line } from '@remixicon/react';
import { loginAdmin } from '../actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    startTransition(async () => {
      const result = await loginAdmin(password);
      if (result.success) {
        // Redirect to admin dashboard
        router.refresh();
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    });
  };

  return (
    <div className='min-h-screen bg-[#0f172a] bg-radial-at-t from-slate-900 via-slate-950 to-black flex items-center justify-center p-4 relative overflow-hidden font-sans'>
      {/* Background blobs */}
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none' />
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none' />

      {/* Login Card */}
      <div className='w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 animate-fade-in'>
        <div className='space-y-6 text-center'>
          {/* Logo / Header */}
          <div className='space-y-2.5'>
            <div className='w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20'>
              K
            </div>
            <h1 className='text-2xl font-black tracking-tight text-white'>Katalin Solutions</h1>
            <p className='text-xs text-slate-400'>
              Hệ thống quản trị danh mục mẫu Giao diện Website
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className='space-y-4 pt-4 text-left'>
            <div className='space-y-2'>
              <label
                htmlFor='password'
                className='text-2xs font-extrabold text-slate-400 uppercase tracking-wider block'
              >
                Mật khẩu quản trị
              </label>
              <div className='relative rounded-xl overflow-hidden shadow-inner'>
                <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
                  <RiLockPasswordLine className='w-4.5 h-4.5' />
                </div>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Nhập mật khẩu truy cập...'
                  disabled={isPending}
                  className='w-full py-3.5 pl-10.5 pr-10.5 bg-slate-950/40 border border-slate-800 focus:border-primary/50 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none transition-all'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer'
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <RiEyeOffLine className='w-4.5 h-4.5' />
                  ) : (
                    <RiEyeLine className='w-4.5 h-4.5' />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl animate-shake'>
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isPending}
              className='w-full py-3.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-extrabold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50'
            >
              {isPending ? (
                <>
                  <RiLoader4Line className='w-4.5 h-4.5 animate-spin' />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <span>Đăng nhập hệ thống</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
