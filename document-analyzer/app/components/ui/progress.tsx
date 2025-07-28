"use client";
import { HTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ value, className, ...props }: Props) {
  return (
    <div className={cn('w-full h-2 bg-gray-200 rounded', className)} {...props}>
      <div
        className="h-full bg-primary rounded"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
} 