"use client";

import { useEffect } from 'react';
import { ProcessingStatus as ProcessingStatusType } from '@/app/types';
import { CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: ProcessingStatusType | null;
}

export function ProcessingStatus({ status }: ProcessingStatusProps) {
  // Add custom animation keyframes on client-side only
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'shimmer-animation';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(300%) skewX(-12deg); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  if (!status) return null;

  const isCompleted = status.stage === 'completed';
  const isError = status.stage === 'error';
  
  const getStageDisplay = (stage: string) => {
    const stages = {
      'uploading': 'Uploading file...',
      'processing-docx': 'Processing DOCX document...',
      'processing-pdf': 'Processing PDF document...',
      'selecting-images': 'Selecting relevant images...',
      'fetching-docs': 'Fetching documentation...',
      'selecting-chunks': 'Analyzing documentation chunks...',
      'analyzing': 'Running AI analysis...',
      'creating-notion': 'Creating Notion page...',
      'posting-telegram': 'Sending Telegram notification...',
      'completed': 'Analysis completed successfully!',
      'error': 'Analysis failed'
    };
    return stages[stage as keyof typeof stages] || stage;
  };

  const getStageIcon = (stage: string) => {
    if (isError) {
      return <AlertCircle className="w-5 h-5 text-destructive" />;
    }
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-status-success" />;
    }
    return <Loader2 className="w-5 h-5 text-media-movie animate-spin" />;
  };

  const getProgressColor = () => {
    if (isError) return 'bg-destructive';
    if (isCompleted) return 'bg-status-success';
    return 'bg-media-movie';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          ${isError 
            ? 'bg-destructive/10' 
            : isCompleted 
              ? 'bg-status-success/10' 
              : 'bg-media-movie/10'
          }
        `}>
          {getStageIcon(status.stage)}
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-foreground">
            {isError ? 'Processing Failed' : isCompleted ? 'Analysis Complete' : 'Processing Document'}
          </h3>
          <p className="font-heading-xs text-muted-foreground">
            {getStageDisplay(status.stage)}
          </p>
        </div>
        {!isError && !isCompleted && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-heading-xs text-muted-foreground">
              Processing...
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-heading-xs text-muted-foreground">
            Progress
          </span>
          <span className="font-heading-xs text-foreground font-medium">
            {status.progress}%
          </span>
        </div>
        
        <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden">
          {/* Background track */}
          <div className="absolute inset-0 bg-gradient-to-r from-muted/10 to-muted/20" />
          
          {/* Progress fill */}
          <div 
            className={`
              absolute left-0 top-0 h-full transition-all duration-500 ease-out rounded-full
              ${getProgressColor()}
            `}
            style={{ width: `${status.progress}%` }}
          />
          
          {/* Animated shimmer effect */}
          {!isCompleted && !isError && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" 
              style={{ 
                animation: 'shimmer 2s infinite',
                width: '30%',
                left: `${Math.max(0, status.progress - 15)}%`
              }} 
            />
          )}
        </div>
      </div>

      {/* Stage details */}
      <div className="bg-card/30 border border-border/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className={`
            w-2 h-2 rounded-full mt-2 flex-shrink-0
            ${isError 
              ? 'bg-destructive animate-pulse' 
              : isCompleted 
                ? 'bg-status-success' 
                : 'bg-media-movie animate-pulse'
            }
          `} />
          <div className="flex-1 min-w-0">
            <p className="font-heading-sm text-foreground">
              {status.message}
            </p>
            {status.error && (
              <div className="mt-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <p className="font-heading-xs text-destructive">
                  Error: {status.error.details}
                </p>
                <p className="font-heading-xs text-muted-foreground mt-1">
                  Code: {status.error.code}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success state */}
      {isCompleted && (
        <div className="bg-status-success/5 border border-status-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0" />
            <div>
              <p className="font-heading-sm text-status-success">
                Document analysis completed successfully
              </p>
              <p className="font-heading-xs text-muted-foreground mt-1">
                Results have been saved to Notion and sent via Telegram
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 