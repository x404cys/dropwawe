'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { User } from '@/types/users/UserForDashboard';

interface WhatsAppContactDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (user: User, message: string) => void;
}
const MESSAGE_TEMPLATES = [
  {
    id: 'welcome_followup',
    label: 'ترحيب ومتابعة المتجر',
    message: `مرحبا أستاذ {name} 👋
أنا مديحة من منصة متاجر

جاهز تكمل متجرك الإلكتروني؟

متاجر المشتركين كملت بوقت أسرع بمتابعتنا وإرشادنا إلهم،
وحالياً أنا جاهزة أسمع أسئلتك وأساعدك تكمل متجرك.

فقط احتاج تزودني بتفاصيل عن متجرك وشنو هي المنتجات الي تقدمها.

إذا جاهز، إحنا جاهزين وبانتظار ردك 🫡`,
  },

  {
    id: 'welcome_onboarding',
    label: 'ترحيب بعد التسجيل',
    message: `يا هلا أستاذ {name} 🌟
نورتنا بمنصة متاجر

أنا مديحة وجاهزة أساعدك تكمل بناء متجرك الإلكتروني.

حسابك صار جاهز وبقى فقط تضيف منتجاتك وترتب متجرك، وأكدر أساعدك بهاي الخطوة إذا تحب.

استغل التجربة المجانية لمدة 7 أيام ورتب متجرك وجرب المنصة بالكامل بشكل مجاني!

تسجيلك اليوم خطوة ذكية لصالح متجرك،
ومتحمسين نشوف نجاحك يكبر 🚀`,
  },

  {
    id: 'trial_reminder',
    label: 'تذكير التجربة المجانية',
    message: `تذكير ممكن يهمك ⏰

مرحبا أستاذ {name}
حبينا نذكرك إنك تكدر تستفيد من التجربة المجانية،
والمتبقي منها 4 أيام وهي مدة كافية حتى تكمل إعداد متجرك وتجرب المنصة بالكامل.

الفرصة بعدها متاحة إلك،
وإذا تحتاج مساعدة، أنا مديحة جاهزة أساعدك بأي وقت.

مشوارك ويا متاجر متوقف على ردك،
وإحنا بانتظار رسالتك 🫡`,
  },

  {
    id: 'inactive_user',
    label: 'متابعة مستخدم غير نشط',
    message: `جاهزين نجاوبك على كل أسئلتك 🫡

مرحبا أستاذ {name}
لاحظنا تسجيلك قبل فترة ولحد الآن ما بديت ببناء متجرك الإلكتروني.

حابين نعرف إذا واجهتك مشكلة باختيار القالب؟ رفع المنتجات؟ أو عندك أي استفسار؟

وإذا تحب نكمل، أنا مديحة من فريق متاجر وجاهزة أساعدك ترتب متجرك وتجهزه بخطوات بسيطة وواضحة.

بانتظار رسالتك 🫡`,
  },
];

const formatIraqiPhone = (phone?: string | null) => {
  if (!phone) return '';

  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('964')) return cleaned;

  if (cleaned.startsWith('0')) {
    return '964' + cleaned.slice(1);
  }

  return cleaned;
};
export function WhatsAppContactDialog({
  user,
  isOpen,
  onClose,
  onSend,
}: WhatsAppContactDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(MESSAGE_TEMPLATES[0].id);
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const template = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate) ?? MESSAGE_TEMPLATES[0];
  const message = customMessage || template.message;
  const finalMessage = message.replace('{name}', user.name || 'User');
  const rawPhone = user.stores?.find(p => p.store.phone)?.store.phone;

  const phoneNumber = formatIraqiPhone(rawPhone);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (!phoneNumber) return;

    window.open(whatsappUrl, '_blank');

    onSend(user, finalMessage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <div className="max-h-[80vh] space-y-5 overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>WhatsApp Message</DialogTitle>
          </DialogHeader>

          <div className="rounded-lg bg-green-50 p-3 text-sm">
            <p className="font-semibold">{user.name || 'Unknown'}</p>
            <p className="text-xs text-green-700">{phoneNumber}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Template</label>

            <select
              value={selectedTemplate}
              onChange={e => {
                setSelectedTemplate(e.target.value);
                setCustomMessage('');
              }}
              className="mt-1 w-full rounded-lg border p-2 text-sm"
            >
              {MESSAGE_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500">Message</label>

            <textarea
              value={customMessage || finalMessage}
              onChange={e => setCustomMessage(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border p-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <DialogFooter className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleCopyMessage} className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'Copied' : 'Copy'}
            </Button>

            <Button
              onClick={handleSend}
              disabled={isLoading || !phoneNumber}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
