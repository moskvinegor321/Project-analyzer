"use client";

import { AnalysisResult } from '@/app/types';
import { Card } from '@/app/components/ui/card';

interface Props {
  result: AnalysisResult | null;
}

export function AnalysisResultView({ result }: Props) {
  if (!result) return null;
  return (
    <Card className="p-6 space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Результат анализа</h2>
      <p><strong>Реализуемость:</strong> {result.feasibility}</p>
      <p><strong>Уверенность:</strong> {Math.round(result.confidence * 100)}%</p>
      <p><strong>Сроки:</strong> {result.estimatedTimeline}</p>
      <p><strong>Комментарии:</strong> {result.comments}</p>
    </Card>
  );
} 