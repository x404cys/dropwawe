'use client';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className = '' }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-2 border-gray-300 border-t-blue-600 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
