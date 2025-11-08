'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface ManagementCardProps {
  index?: number;
  title: string;
  description: string;
  description2?: string;
  button1Text: string;
  button1Icon?: ReactNode;
  button1Variant?: 'default' | 'outline' | 'ghost' | 'link';
  onButton1Click?: () => void;
  button2Text: string;
  button2Icon?: ReactNode;
  button2Variant?: 'default' | 'outline' | 'ghost' | 'link';
  onButton2Click?: () => void;
}

export default function ManagementCard({
  index = 0,
  title,
  description,
  description2,
  button1Text,
  button1Icon,
  button1Variant = 'default',
  onButton1Click,
  button2Text,
  button2Icon,
  button2Variant = 'outline',
  onButton2Click,
}: ManagementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group"
    >
      <div className="relative flex h-[40vh] flex-col justify-between rounded-lg border  border-gray-200 bg-white px-5 py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md hover:shadow-gray-200">
        <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed text-gray-600">{description}</p>
          {description2 && <p className="text-sm leading-relaxed text-gray-600">{description2}</p>}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            variant={button1Variant}
            onClick={onButton1Click}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium shadow-none transition-all hover:scale-[1.03]"
          >
            {button1Icon}
            <span>{button1Text}</span>
          </Button>

          <Button
            variant={button2Variant}
            onClick={onButton2Click}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium shadow-none transition-all hover:scale-[1.03]"
          >
            {button2Icon}
            <span>{button2Text}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
