'use client';

import HeroDesktop from '@/components/desktop/hero-desktop';
import ServicesDesktop from '@/components/desktop/services-desktop';
import AboutDesktop from '@/components/desktop/about-desktop';
import PortfolioDesktop from '@/components/desktop/portfolio-desktop';
import PricingDesktop from '@/components/desktop/pricing-desktop';
import TestimonialsDesktop from '@/components/desktop/testimonials-desktop';

import HeroMobile from '@/components/mobile/hero-mobile';
import ServicesMobile from '@/components/mobile/services-mobile';
import AboutMobile from '@/components/mobile/about-mobile';
import PortfolioMobile from '@/components/mobile/portfolio-mobile';
import PricingMobile from '@/components/mobile/pricing-mobile';
import TestimonialsMobile from '@/components/mobile/testimonials-mobile';

import ContactForm from '@/components/shared/contact-form';
import Container from '@/components/shared/container';

export default function Home() {
  return (
    <div className='w-full'>
      {/* ========================================================
          DESKTOP VIEW (hiển thị trên màn hình md trở lên)
          ======================================================== */}
      <div className='hidden md:block'>
        <HeroDesktop />
        <ServicesDesktop />
        <AboutDesktop />
        <PortfolioDesktop />
        <PricingDesktop />
        <TestimonialsDesktop />
      </div>

      {/* ========================================================
          MOBILE VIEW (hiển thị trên màn hình dưới md)
          ======================================================== */}
      <div className='block md:hidden'>
        <HeroMobile />
        <ServicesMobile />
        <AboutMobile />
        <PortfolioMobile />
        <PricingMobile />
        <TestimonialsMobile />
      </div>

      {/* ========================================================
          SHARED CONTACT SECTION (dùng chung cho cả 2 giao diện)
          ======================================================== */}
      <section
        id='contact-section'
        className='py-20 bg-background relative overflow-hidden border-t'
      >
        <div className='absolute inset-0 bg-primary/[0.02] pointer-events-none' />
        <Container className='relative z-10 px-4'>
          <ContactForm />
        </Container>
      </section>
    </div>
  );
}
