"use client";

import { useState } from 'react';
import { FileUpload } from '@/app/components/FileUpload';
import { ProcessingStatus } from '@/app/components/ProcessingStatus';
import { AnalysisResultView } from '@/app/components/AnalysisResult';
import { DocumentationInput } from '@/app/components/DocumentationInput';
import { AnalysisResult, ProcessingStatus as StatusType } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { arrayBufferToBase64 } from '@/app/lib/utils';
import { Play, FileText, Globe, Zap, Brain, Send } from 'lucide-react';

export function SubmitForm() {
  const [file, setFile] = useState<File | null>(null);
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusType | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async () => {
    if (!file) return;

    setStatus({ stage: 'uploading', progress: 0, message: 'Starting upload...' });
    setResult(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      const base64File = arrayBufferToBase64(fileBuffer);

      setStatus({ stage: 'analyzing', progress: 50, message: 'Analyzing document...' });

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64File,
          filename: file.name,
          mimeType: file.type,
          docUrls: docUrls
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setStatus({ stage: 'completed', progress: 100, message: 'Analysis complete!' });
    } catch (error) {
      console.error('Analysis failed:', error);
      setStatus({ 
        stage: 'error', 
        progress: 0, 
        message: 'Analysis failed', 
        error: { code: 'UPLOAD_ERROR', details: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  };

  const isReady = file && (!status || status.stage === 'completed' || status.stage === 'error');

  return (
    <div className="space-y-8">
      {/* Main grid layout - KATALOG style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column - File upload and documentation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* File Upload Section */}
          <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-media-movie/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-media-movie" />
              </div>
              <div>
                <h3 className="font-heading text-foreground">Upload Document</h3>
                <p className="font-heading-xs text-muted-foreground">PDF or DOCX files up to 50MB</p>
              </div>
            </div>
            
            <FileUpload onFileSelect={setFile} selectedFile={file} />
          </div>

          {/* Documentation URLs Section */}
          <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-media-tv/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-media-tv" />
              </div>
              <div>
                <h3 className="font-heading text-foreground">Documentation Links</h3>
                <p className="font-heading-xs text-muted-foreground">Additional context for precise analysis</p>
              </div>
            </div>
            
            <DocumentationInput urls={docUrls} onChange={setDocUrls} />
          </div>
        </div>

        {/* Right column - Analysis panel */}
        <div className="space-y-6">
          
          {/* Analysis Control Panel */}
          <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm">
            <div className="text-center space-y-4 mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-media-book/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-media-book" />
              </div>
              
              <div>
                <h3 className="font-heading-lg text-foreground mb-2">AI Document Analyzer</h3>
                <p className="font-heading-xs text-muted-foreground leading-relaxed">
                  Get structured analysis with automatic categorization and insights extraction
                </p>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-3 mb-6">
              {[
                { icon: <Zap className="w-4 h-4" />, text: "Claude AI Analysis", color: "text-media-movie" },
                { icon: <FileText className="w-4 h-4" />, text: "Structured Output", color: "text-media-tv" },
                { icon: <Send className="w-4 h-4" />, text: "Notion Integration", color: "text-media-album" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={feature.color}>
                    {feature.icon}
                  </div>
                  <span className="font-heading-sm text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Action button */}
            <Button
              onClick={handleSubmit}
              disabled={!isReady}
              className={`w-full h-12 rounded-xl font-heading transition-all duration-300 ${
                isReady 
                  ? 'btn-primary hover:scale-105' 
                  : 'bg-muted/20 text-muted-foreground cursor-not-allowed border border-border/20'
              }`}
            >
              {(!status || status.stage === 'completed' || status.stage === 'error') && (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Analysis
                </>
              )}
              {status && status.stage !== 'completed' && status.stage !== 'error' && (
                <>
                  <div className="w-5 h-5 mr-2 animate-spin border-2 border-white/30 border-t-white rounded-full" />
                  Processing...
                </>
              )}
            </Button>

            {/* Status info */}
            {file && (
              <div className="pt-4 border-t border-border/20 mt-4">
                <div className="font-heading-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Selected file:</span>
                    <span className="text-foreground font-medium">{file.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="text-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  {docUrls.length > 0 && (
                    <div className="flex justify-between">
                      <span>Context URLs:</span>
                      <span className="text-foreground">{docUrls.length}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {status && status.stage !== 'completed' && (
        <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm">
          <ProcessingStatus status={status} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm">
          <AnalysisResultView result={result} />
        </div>
      )}
    </div>
  );
} 