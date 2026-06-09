'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { submitContactAction } from '@/app/[locale]/admin/actions';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('required');
    if (!formData.phone.trim()) {
      newErrors.phone = t('required');
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = t('error'); // Simplistic phone validation
    }
    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('error');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const res = await submitContactAction({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });
      if (res.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 max-w-lg mx-auto p-6 md:p-8 bg-card border rounded-2xl shadow-xl backdrop-blur-md bg-opacity-70 dark:bg-opacity-70 transition-all duration-300 hover:shadow-2xl hover:border-primary/20'
    >
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-foreground mb-2'>{t('title')}</h3>
        <p className='text-sm text-muted-foreground'>{t('subtitle')}</p>
      </div>

      {status === 'success' && (
        <div className='p-4 text-sm bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-center animate-fade-in'>
          {t('success')}
        </div>
      )}

      {status === 'error' && (
        <div className='p-4 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center animate-fade-in'>
          {t('error')}
        </div>
      )}

      <div className='space-y-1'>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder={t('placeholderName')}
          className={`w-full px-4 py-3 rounded-xl border bg-background text-sm transition-all focus:outline-none focus:ring-2 ${
            errors.name
              ? 'border-destructive focus:ring-destructive/20'
              : 'border-border focus:border-primary focus:ring-primary/20'
          }`}
          disabled={status === 'submitting'}
        />
        {errors.name && <span className='text-xs text-destructive pl-1'>{errors.name}</span>}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-1'>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder={t('placeholderEmail')}
            className={`w-full px-4 py-3 rounded-xl border bg-background text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-destructive focus:ring-destructive/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            }`}
            disabled={status === 'submitting'}
          />
          {errors.email && <span className='text-xs text-destructive pl-1'>{errors.email}</span>}
        </div>

        <div className='space-y-1'>
          <input
            type='text'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('placeholderPhone')}
            className={`w-full px-4 py-3 rounded-xl border bg-background text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.phone
                ? 'border-destructive focus:ring-destructive/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            }`}
            disabled={status === 'submitting'}
          />
          {errors.phone && <span className='text-xs text-destructive pl-1'>{errors.phone}</span>}
        </div>
      </div>

      <div className='space-y-1'>
        <textarea
          name='message'
          value={formData.message}
          onChange={handleChange}
          placeholder={t('placeholderMsg')}
          rows={4}
          className='w-full px-4 py-3 rounded-xl border border-border bg-background text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none'
          disabled={status === 'submitting'}
        />
      </div>

      <Button
        type='submit'
        className='w-full py-6 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2'
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <svg className='animate-spin h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        ) : null}
        {t('sendBtn')}
      </Button>
    </form>
  );
}
