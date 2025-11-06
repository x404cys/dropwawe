'use client';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 border-border/50 fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="group flex cursor-pointer items-center gap-3">
            <div className="bg-gradient-primary shadow-colored group-hover:shadow-glow rounded-xl p-2 transition-all duration-300">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">
              سهل
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {['التسعير', 'الأسعار', 'خدماتنا', 'الدعم'].map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-foreground/80 hover:text-primary group relative text-sm font-medium transition-colors duration-200"
              >
                {item}
                <span className="bg-gradient-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Action Buttons - Desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200"
            >
              <User className="ml-2 h-4 w-4" />
              تسجيل الدخول
            </Button>
            <Button
              size="sm"
              className="bg-gradient-primary hover:shadow-colored transition-all duration-300 hover:scale-105"
            >
              إنشاء حساب
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground/80 hover:text-primary p-2 transition-colors md:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-border/50 animate-fade-up mt-4 border-t pt-4 md:hidden">
            <nav className="mb-4 flex flex-col gap-4">
              {['التسعير', 'الأسعار', 'خدماتنا', 'الدعم'].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-foreground/80 hover:text-primary py-2 text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/80 hover:text-primary justify-start"
              >
                <User className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                إنشاء حساب
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
