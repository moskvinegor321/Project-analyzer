"use client";
import { HTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border rounded-lg bg-white dark:bg-gray-900', className)} {...props} />;
} 