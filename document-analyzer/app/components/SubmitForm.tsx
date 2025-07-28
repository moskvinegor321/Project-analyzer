"use client";

import { useState } from 'react';
import { FileUpload } from '@/app/components/FileUpload';
import { ProcessingStatus } from '@/app/components/ProcessingStatus';
import { AnalysisResultView } from '@/app/components/AnalysisResult';
import { DocumentationInput } from '@/app/components/DocumentationInput';
import { AnalysisResult, ProcessingStatus as StatusType } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { arrayBufferToBase64 } from '@/app/lib/utils';

export function SubmitForm() {
  const [file, setFile] = useState<File | null>(null);
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusType | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  async function handleSubmit() {
    if (!file) return;
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
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left column: form */}
      <div className="space-y-6">
        <FileUpload selectedFile={file} onFileSelect={setFile} />
        <DocumentationInput urls={docUrls} onChange={setDocUrls} />
        <Button onClick={handleSubmit}>Запустить анализ</Button>
      </div>

      {/* Right column: status + result */}
      <div className="space-y-6">
        {status && <ProcessingStatus status={status} />}
        <AnalysisResultView result={analysis} />
      </div>
    </div>
  );
} 