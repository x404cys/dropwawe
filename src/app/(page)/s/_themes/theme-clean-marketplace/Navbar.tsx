// THEME: clean-marketplace - Navbar

'use client';

import { ArrowUpDown, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { NavbarProps } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';

export default function CleanMarketplaceNavbar({
  store,
  colors,
  fonts,
  hasAnnouncementBar,
}: NavbarProps) {
  const [stockOnly, setStockOnly] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const { t } = useLanguage();

  const scrollToSearch = () => {
    document
      .getElementById('store-search')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const controlBaseClass =
    'flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-all duration-200 ease-in-out hover:border-gray-400';

  return (
    <header
      className={`sticky z-50 border-b border-gray-100 bg-white ${hasAnnouncementBar ? 'top-9' : 'top-0'}`}
    >
      <div className="px-4 py-3 lg:px-8">
        {/* DESIGN: The navbar prioritizes marketplace controls over marketing navigation so the store feels transactional and familiar. */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {store.image ? (
              <img
                src={store.image}
                alt={store.name ?? ''}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gray-100" />
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className="truncate text-sm font-semibold text-gray-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {store.name}
                </p>
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{ backgroundColor: colors.accent }}
                >
                  ✓
                </span>
              </div>
              {store.description ? (
                <p className="truncate text-xs text-gray-500 lg:hidden">{store.description}</p>
              ) : null}
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <select
              className={controlBaseClass}
              defaultValue="IQD"
              style={{ fontFamily: fonts.heading }}
            >
              <option value="IQD">IQD</option>
            </select>

            <button
              type="button"
              className={controlBaseClass}
              style={{ fontFamily: fonts.heading }}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>ترتيب</span>
            </button>

            <button
              type="button"
              onClick={() => setStockOnly(current => !current)}
              className={`${controlBaseClass} ${stockOnly ? 'text-white' : ''}`}
              style={
                stockOnly
                  ? {
                      backgroundColor: colors.accent,
                      borderColor: colors.accent,
                      fontFamily: fonts.heading,
                    }
                  : { fontFamily: fonts.heading }
              }
            >
              <span>متوفر فقط</span>
            </button>

            <button
              type="button"
              onClick={scrollToSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-200 ease-in-out hover:border-gray-400 hover:text-gray-900"
              aria-label={t.store.searchPlaceholder}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={scrollToSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-200 ease-in-out hover:border-gray-400 hover:text-gray-900"
              aria-label={t.store.searchPlaceholder}
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileToolsOpen(current => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-200 ease-in-out hover:border-gray-400 hover:text-gray-900"
              aria-label="أدوات المتجر"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-200 ease-in-out lg:hidden ${
            mobileToolsOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
              <select
                className={controlBaseClass}
                defaultValue="IQD"
                style={{ fontFamily: fonts.heading }}
              >
                <option value="IQD">IQD</option>
              </select>

              <button
                type="button"
                className={controlBaseClass}
                style={{ fontFamily: fonts.heading }}
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>ترتيب</span>
              </button>

              <button
                type="button"
                onClick={() => setStockOnly(current => !current)}
                className={`${controlBaseClass} ${stockOnly ? 'text-white' : ''}`}
                style={
                  stockOnly
                    ? {
                        backgroundColor: colors.accent,
                        borderColor: colors.accent,
                        fontFamily: fonts.heading,
                      }
                    : { fontFamily: fonts.heading }
                }
              >
                <span>متوفر فقط</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
