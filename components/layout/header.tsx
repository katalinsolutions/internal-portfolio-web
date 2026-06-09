'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  RiMenuLine,
  RiCloseLine,
  RiPhoneLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Container from '@/components/shared/container';
import ThemeToggle from '@/components/shared/theme-toggle';
import LanguageSwitcher from '@/components/shared/language-switcher';

import { logoDark, logoLight } from '@/assets/images';
import { Link } from '@/i18n/navigation';
import { CONTACT_CONFIG } from '@/lib/config';

interface HeaderProps {
  hotline?: string;
}

export default function Header({ hotline = CONTACT_CONFIG.hotline }: HeaderProps) {
  // Mobile drawer states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMauWebOpen, setIsMobileMauWebOpen] = useState(false);
  const [mobileActiveSubmenu, setMobileActiveSubmenu] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileMauWebOpen(false);
    setMobileActiveSubmenu(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileMauWebOpen(false);
    setMobileActiveSubmenu(null);
  };

  const toggleMobileMauWeb = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMauWebOpen(!isMobileMauWebOpen);
  };

  const toggleMobileSubmenu = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileActiveSubmenu(mobileActiveSubmenu === key ? null : key);
  };

  const menuData = {
    webTemplates: {
      label: 'Mẫu website',
      items: [
        {
          key: 'sales',
          label: 'Website bán hàng',
          subItems: [
            'Website bán đồ cưới',
            'Website công nghệ & điện máy',
            'Website nội thất & gia dụng',
            'Website thời trang & phụ kiện',
            'Website phụ tùng ô tô xe máy',
            'Website hoa tươi & quà tặng',
            'Website sách & văn phòng phẩm',
            'Website đồ chơi trẻ em',
          ],
        },
        {
          key: 'services',
          label: 'Website dịch vụ',
          subItems: [
            'Spa & Thẩm mỹ viện',
            'Du lịch & Khách sạn',
            'Giáo dục & Trường học',
            'Nhà hàng & F&B',
            'Phòng gym & Yoga',
          ],
        },
        {
          key: 'intro',
          label: 'Website giới thiệu',
          subItems: [
            'Giới thiệu doanh nghiệp',
            'Bất động sản',
            'Xây dựng & Kiến trúc',
            'Vận tải & Logistics',
            'Hồ sơ năng lực cá nhân',
          ],
        },
        {
          key: 'landing',
          label: 'Landing page',
        },
        {
          key: 'custom',
          label: 'Thiết kế theo yêu cầu',
        },
      ],
    },
  };

  const navLinks = [
    { href: '/#about-section', label: 'Giới thiệu' },
    { href: '/#services-section', label: 'Dịch vụ' },
    { href: '/#portfolio-section', label: 'Dự án' },
    { href: '/#pricing-section', label: 'Bảng giá' },
  ];

  return (
    <header className='border-b h-16 flex justify-center items-center sticky top-0 z-50 bg-background/80 backdrop-blur-md'>
      <Container>
        <nav className='flex items-center justify-between'>
          {/* Logo */}
          <Link href={'/'} onClick={closeMenu}>
            <Image
              src={logoDark}
              height={32}
              width={120}
              alt='Logo'
              priority
              className='hidden dark:block object-contain'
            />
            <Image
              src={logoLight}
              height={32}
              width={120}
              alt='Logo'
              priority
              className='dark:hidden object-contain'
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className='hidden md:flex items-center gap-8'>
            {/* Multi-level Dropdown "Mẫu website" */}
            <div className='relative group/dropdown py-4'>
              <Link
                href='/templates'
                className='text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer'
              >
                {menuData.webTemplates.label}
                <RiArrowDownSLine className='w-4 h-4' />
              </Link>

              {/* Level 1 Dropdown */}
              <div className='absolute top-full left-0 mt-0 w-60 bg-card border rounded-2xl shadow-xl hidden group-hover/dropdown:block py-2 animate-fade-in'>
                {menuData.webTemplates.items.map((item) => (
                  <div key={item.key} className='relative group/sub'>
                    <Link
                      href={`/templates?category=${item.key}`}
                      className='flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all'
                    >
                      {item.label}
                      {item.subItems && (
                        <RiArrowRightSLine className='w-4 h-4 text-muted-foreground' />
                      )}
                    </Link>

                    {/* Level 2 Submenu (Slides to the right) */}
                    {item.subItems && (
                      <div className='absolute top-0 left-[99%] ml-0 w-64 bg-card border rounded-2xl shadow-xl hidden group-hover/sub:block py-2 animate-fade-in max-h-[400px] overflow-y-auto'>
                        {item.subItems.map((subItem, idx) => (
                          <Link
                            key={idx}
                            href={`/templates?category=${item.key}&search=${encodeURIComponent(subItem)}`}
                            className='block px-4 py-2 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all'
                          >
                            {subItem}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm font-bold text-muted-foreground hover:text-primary transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions (Desktop) */}
          <div className='hidden md:flex items-center gap-3'>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {/* Mobile menu trigger */}
          <div className='flex md:hidden items-center gap-2'>
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              className='p-2 text-foreground hover:text-primary transition-colors focus:outline-none'
              aria-label='Toggle menu'
            >
              {isMenuOpen ? (
                <RiCloseLine className='w-6 h-6' />
              ) : (
                <RiMenuLine className='w-6 h-6' />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Drawer (Giao diện Menu Mobile riêng biệt - Dạng Collapsible Accordion) */}
      {isMenuOpen && (
        <div className='fixed inset-x-0 top-16 bottom-0 bg-background z-40 flex flex-col justify-between p-6 border-t md:hidden animate-fade-in overflow-y-auto'>
          <div className='space-y-4'>
            {/* Mẫu Website Accordion */}
            <div className='border-b border-border/50 pb-2'>
              <button
                onClick={toggleMobileMauWeb}
                className='flex items-center justify-between w-full text-base font-black text-foreground hover:text-primary transition-colors py-2'
              >
                <span>{menuData.webTemplates.label}</span>
                <RiArrowDownSLine
                  className={`w-5 h-5 transition-transform duration-300 ${isMobileMauWebOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Mobile Level 1 items */}
              {isMobileMauWebOpen && (
                <div className='pl-4 mt-2 space-y-2 animate-fade-in'>
                  {/* Link to all templates */}
                  <Link
                    href='/templates'
                    onClick={closeMenu}
                    className='block py-1.5 text-sm font-bold text-primary border-b border-border/20 pb-1.5'
                  >
                    Tất cả mẫu website
                  </Link>

                  {menuData.webTemplates.items.map((item) => (
                    <div key={item.key} className='space-y-1.5'>
                      {item.subItems ? (
                        <>
                          <button
                            onClick={(e) => toggleMobileSubmenu(item.key, e)}
                            className='flex items-center justify-between w-full text-sm font-bold text-foreground/80 hover:text-primary py-1.5'
                          >
                            <span>{item.label}</span>
                            <RiArrowDownSLine
                              className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                                mobileActiveSubmenu === item.key ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Mobile Level 2 items */}
                          {mobileActiveSubmenu === item.key && (
                            <div className='pl-4 space-y-1 border-l border-border/60 animate-fade-in max-h-[240px] overflow-y-auto'>
                              {item.subItems.map((subItem, idx) => (
                                <Link
                                  key={idx}
                                  href={`/templates?category=${item.key}&search=${encodeURIComponent(subItem)}`}
                                  onClick={closeMenu}
                                  className='block py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary'
                                >
                                  {subItem}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={`/templates?category=${item.key}`}
                          onClick={closeMenu}
                          className='block py-1.5 text-sm font-bold text-foreground/80 hover:text-primary'
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other static Nav Links */}
            <div className='flex flex-col gap-2'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className='text-base font-black text-foreground hover:text-primary transition-colors py-2 border-b border-border/50'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className='space-y-4 pt-6 border-t mt-6'>
            {/* Quick action hotline */}
            <Button
              asChild
              className='w-full py-6 rounded-xl font-bold text-sm bg-primary text-primary-foreground shadow-md flex items-center justify-center gap-2'
            >
              <a href={`tel:${hotline}`} onClick={closeMenu}>
                <RiPhoneLine className='w-5 h-5' />
                Hotline: {hotline.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
