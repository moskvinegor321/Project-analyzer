"use client";

import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ProcessingStatus as ProcessingStatusType } from '@/app/types';

interface ProcessingStatusProps {
  status: ProcessingStatusType;
}

export function ProcessingStatus({ status }: ProcessingStatusProps) {
  const isError = status.stage === 'error';

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {isError ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          )}
          <h3 className="text-lg font-semibold">
            {isError ? 'Произошла ошибка' : 'Обработка документа'}
          </h3>
        </div>

        <Progress value={status.progress} className="w-full" />

        <div className="text-center">
          <p className={isError ? 'text-red-700' : 'text-gray-700'}>{status.message}</p>
          <p className="text-sm text-gray-500 mt-1">{status.progress}% завершено</p>
          {isError && status.error && (
            <p className="text-xs text-red-500 mt-2">Код ошибки: {status.error.code}</p>
          )}
        </div>
      </div>
    </Card>
  );
} 