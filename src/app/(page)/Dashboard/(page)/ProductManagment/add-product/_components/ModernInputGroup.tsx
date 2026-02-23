'use client';

import type React from 'react';
import { Input } from '@/components/ui/input';

interface ModernInputGroupProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  value?: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  onBlur?: () => void;
}

export function ModernInputGroup({
  label,
  required,
  placeholder,
  type = 'text',
  icon,
  value,
  onChange,
  disabled,
  onBlur,
}: ModernInputGroupProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl">
      <label className="text-sm text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <Input
          type={type}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder || label}
          className="rounded-xl border bg-white pr-3 pl-10 font-light transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
        />
        {icon && <span className="absolute top-1/2 left-3 -translate-y-1/2">{icon}</span>}
      </div>
    </div>
  );
}
