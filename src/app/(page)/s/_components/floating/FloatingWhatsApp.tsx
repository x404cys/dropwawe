// Purpose: Floating WhatsApp button - Client Component.
// fixed bottom-6 left-4, always visible when whatsapp number is provided.

'use client';

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../../_context/LanguageContext';
import { buildContactItems } from '../../_utils/contacts';
import type { StorefrontStore, StorefrontTemplate } from '../../_lib/types';

interface FloatingWhatsAppProps {
  template: StorefrontTemplate;
  store: StorefrontStore;
}

export default function FloatingWhatsApp({ template, store }: FloatingWhatsAppProps) {
  const { t } = useLanguage();
  const whatsappItem = buildContactItems(template, store).find(
    (item) => item.type === 'whatsapp' && item.enabled && item.value.trim().length > 0
  );
  if (!whatsappItem) return null;

  const number = whatsappItem.value.replace(/\s+/g, '');

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30 bg-[#25D366] hover:scale-105 transition-transform"
      aria-label={t.floating.whatsappAria}
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  );
}
