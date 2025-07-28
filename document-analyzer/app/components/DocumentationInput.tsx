'use client';
import React, { useState, ChangeEvent } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BookOpen, Plus, Link, X, ExternalLink } from 'lucide-react';

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

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUrl();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-slate-800">Дополнительная документация</h3>
      </div>
      
      <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-purple-50/50 p-6">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Добавьте ссылки на техническую документацию для более точного анализа
          </p>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://docs.example.com/api"
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
              />
            </div>
            <Button 
              onClick={addUrl} 
              disabled={!input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
          
          {urls.length > 0 && (
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Добавленные ссылки ({urls.length})
                </span>
                {urls.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => onChange([])}
                    className="text-xs text-slate-500 hover:text-red-600 p-1"
                  >
                    Очистить все
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {urls.map((url, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/50 group hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{url}</p>
                        <p className="text-xs text-slate-500">Документация #{idx + 1}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => window.open(url, '_blank')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-50"
                        title="Открыть ссылку"
                      >
                        <ExternalLink className="w-3 h-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => removeUrl(idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50"
                        title="Удалить ссылку"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {urls.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-sm text-slate-500">
                Пока нет добавленных ссылок на документацию
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 