"use client";

import { useState } from 'react';
import { FileUpload } from '@/app/components/FileUpload';
import { ProcessingStatus } from '@/app/components/ProcessingStatus';
import { AnalysisResultView } from '@/app/components/AnalysisResult';
import { DocumentationInput } from '@/app/components/DocumentationInput';
import { AnalysisResult, ProcessingStatus as StatusType } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { arrayBufferToBase64 } from '@/app/lib/utils';
import { Play, Sparkles, Zap } from 'lucide-react';

export function SubmitForm() {
  const [file, setFile] = useState<File | null>(null);
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusType | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleSubmit() {
    if (!file) return;
    
    setIsAnalyzing(true);
    setStatus(null);
    setAnalysis(null);
    
    try {
      // Step 1 fetch documentation
      let documentation: any = null;
      if (docUrls.length) {
        const res = await fetch('/api/documentation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: docUrls }),
        });
        const data = await res.json();
        documentation = { rawMarkdown: data.rawMarkdown };
      }

      // Step 2 analyze with SSE
      const reader = new TextDecoderStream();
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: {
            projectName: 'Test',
            telegramUsername: '@tester',
            documentationUrls: docUrls,
            quotaLink: 'https://example.com',
            blobUrl: '',
            fileName: file.name,
          },
          file: {
            name: file.name,
            type: file.type,
            data: await file.arrayBuffer().then((b) => arrayBufferToBase64(b)),
          },
          documentation,
        }),
      });
      if (!resp.body) return;
      const stream = resp.body.pipeThrough(reader).getReader();
      let buffer = '';
      while (true) {
        const { value, done } = await stream.read();
        if (done) break;
        buffer += value;
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';
        for (const chunk of parts) {
          const [eventLine, dataLine] = chunk.split('\n');
          const event = eventLine.replace('event: ', '').trim();
          const data = JSON.parse(dataLine.replace('data: ', ''));
          if (event === 'status') setStatus(data);
          if (event === 'result') setAnalysis(data.analysis);
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const canAnalyze = file && !isAnalyzing;

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column: Upload and Documentation */}
        <div className="space-y-6">
          <FileUpload selectedFile={file} onFileSelect={setFile} />
          <DocumentationInput urls={docUrls} onChange={setDocUrls} />
        </div>

        {/* Right column: Action and Status */}
        <div className="space-y-6">
          {/* Analysis Button */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-800">Запуск анализа</h3>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    AI Document Analyzer
                  </h4>
                  <p className="text-sm text-slate-600 mb-6">
                    Получите структурированный анализ документа с автоматическим созданием отчёта в Notion и уведомлением в Telegram
                  </p>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!canAnalyze}
                  className={`w-full py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    canAnalyze
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Анализирую документ...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-3" />
                      Запустить анализ
                    </>
                  )}
                </Button>

                {!file && (
                  <p className="text-xs text-amber-600 text-center">
                    💡 Сначала загрузите документ для анализа
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status Display */}
          {status && (
            <div className="space-y-4">
              <ProcessingStatus status={status} />
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="mt-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Результаты анализа</h3>
            </div>
            <AnalysisResultView result={analysis} />
          </div>
        </div>
      )}
    </div>
  );
} 