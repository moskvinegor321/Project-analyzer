'use client';
import React, { useState, ChangeEvent } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

interface DocumentationInputProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function DocumentationInput({ urls, onChange }: DocumentationInputProps) {
  const [input, setInput] = useState('');

  function addUrl() {
    const url = input.trim();
    if (!url) return;
    onChange([...urls, url]);
    setInput('');
  }

  function removeUrl(idx: number) {
    onChange(urls.filter((_, i) => i !== idx));
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Ссылки на документацию</h3>
      <div className="flex space-x-2">
        <input
          type="url"
          placeholder="https://example.com/doc"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <Button onClick={addUrl} disabled={!input.trim()}>
          Добавить
        </Button>
      </div>
      {urls.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {urls.map((u, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="break-all">{u}</span>
              <Button variant="ghost" onClick={() => removeUrl(idx)}>
                ✕
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
} 