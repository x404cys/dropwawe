'use client';

import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PriceInputProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
}

export default function PriceInput({
  value,
  min,
  max,
  onChange,
  label = 'حدد سعرك',
  placeholder,
}: PriceInputProps) {
  const [inputValue, setInputValue] = useState(value === 0 ? '' : String(value));
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue === '') {
        setError('');
        onChange(0);
        return;
      }

      const num = Number(inputValue);

      if (isNaN(num)) return;

      if (num < min) {
        setError(`السعر يجب أن لا يقل عن ${formatIQD(min)}`);
      } else if (num > max) {
        setError(`السعر يجب أن لا يتجاوز ${formatIQD(max)}`);
      } else {
        setError('');
      }

      onChange(num);
    }, 900);

    return () => clearTimeout(timer);
  }, [inputValue, min, max, onChange]);

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} ({formatIQD(min)} - {formatIQD(max)})
      </label>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300">
        <DollarSign className="h-4 w-4 text-gray-400" />

        <input
          type="number"
          value={inputValue}
          placeholder={placeholder}
          step="0.01"
          onChange={e => setInputValue(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
