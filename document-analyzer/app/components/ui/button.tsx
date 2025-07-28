"use client";

import { cn } from '@/app/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const base =
    variant === 'ghost'
      ? 'px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800'
      : 'px-4 py-2 rounded bg-primary text-white hover:bg-primary/90';
  return <button className={cn(base, className)} {...props} />;
} 