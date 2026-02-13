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
    id: 'renewal',
    label: 'Subscription Renewal',
    message: 'Hi {name}, your subscription is expiring soon. Click here to renew your plan.',
  },
  {
    id: 'support',
    label: 'Support Follow-up',
    message: 'Hi {name}, we wanted to check if you need any assistance with your account.',
  },
  {
    id: 'promotion',
    label: 'Special Promotion',
    message: 'Hi {name}, check out our new premium features at a special price just for you!',
  },
  {
    id: 'feedback',
    label: 'Request Feedback',
    message: 'Hi {name}, we would love to hear your feedback about our service.',
  },
];

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

  const template = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate)!;
  const message = customMessage || template.message;
  const finalMessage = message.replace('{name}', user.name || 'User');
  const phoneNumber = user.phone?.replace(/\D/g, '') || '';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(finalMessage)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      onSend(user, finalMessage);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact via WhatsApp</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-gray-700">Sending to:</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{user.name || 'Unknown'}</p>
            {phoneNumber ? (
              <p className="mt-1 text-sm text-green-700">📱 {user.phone}</p>
            ) : (
              <p className="mt-1 text-sm text-red-700">⚠️ No phone number available</p>
            )}
          </div>

          {/* Template Selection */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">Message Template</p>
            <div className="grid gap-2">
              {MESSAGE_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    setCustomMessage('');
                  }}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    selectedTemplate === t.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{t.label}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-gray-600">{t.message}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-900">Message Preview</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm break-words text-gray-900">{finalMessage}</p>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <p className="mb-2 text-xs font-medium tracking-widest text-gray-500 uppercase">
              Or write your own message
            </p>
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              placeholder="Leave empty to use template..."
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-1 gap-2">
            <Button variant="outline" onClick={handleCopyMessage} className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Message'}
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading || !phoneNumber}
            className="bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send via WhatsApp'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
