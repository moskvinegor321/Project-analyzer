"use client";

import { useState } from 'react';
import { FileUpload } from '@/app/components/FileUpload';
import { DocumentationInput } from '@/app/components/DocumentationInput';
import { ProcessingStatus } from '@/app/components/ProcessingStatus';
import { AnalysisResultView } from '@/app/components/AnalysisResult';
import { ProcessingStatus as ProcessingStatusType, AnalysisResult } from '@/app/types';

export function SubmitForm() {
  const [file, setFile] = useState<File | null>(null);
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<ProcessingStatusType | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const isReady = file !== null;

  const handleSubmit = async () => {
    if (!file) return;

    console.log('🚀 Starting analysis...', { file: file.name, docUrls });
    // Implementation will be added later
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr 1fr'
    }
  };

  const cardStyle = {
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.08) 0%, 
        rgba(255, 255, 255, 0.02) 100%
      )
    `,
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  };

  const iconContainerStyle = (bgColor: string) => ({
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '0.75rem',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem'
  });

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#fafafa',
    margin: 0
  };

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: '#a1a1aa',
    margin: 0
  };

  const controlPanelStyle = {
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.12) 0%, 
        rgba(255, 255, 255, 0.04) 100%
      )
    `,
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center' as const,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 1px 0 rgba(255, 255, 255, 0.1) inset
    `
  };

  const buttonStyle = {
    width: '100%',
    height: '3rem',
    borderRadius: '0.75rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
    ...(isReady 
      ? {
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white',
          boxShadow: `
            0 8px 16px rgba(59, 130, 246, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `
        }
      : {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#71717a',
          cursor: 'not-allowed',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
    )
  };

  const statusCardStyle = {
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.08) 0%, 
        rgba(255, 255, 255, 0.02) 100%
      )
    `,
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginTop: '2rem'
  };

  const featureListStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginBottom: '2rem'
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };

  const featureIconStyle = (color: string) => ({
    color: color,
    fontSize: '1.125rem'
  });

  const featureTextStyle = {
    color: '#d1d5db',
    fontSize: '0.875rem'
  };

  const fileInfoStyle = {
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    marginTop: '1rem'
  };

  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  };

  const infoLabelStyle = {
    fontSize: '0.875rem',
    color: '#a1a1aa'
  };

  const infoValueStyle = {
    fontSize: '0.875rem',
    color: '#fafafa',
    fontWeight: '500'
  };

  return (
    <div>
      {/* Main Form Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        
        {/* File Upload */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={iconContainerStyle('linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)')}>
              📄
            </div>
            <div>
              <h3 style={titleStyle}>Upload Document</h3>
              <p style={subtitleStyle}>PDF or DOCX files up to 50MB</p>
            </div>
          </div>
          <FileUpload 
            onFileSelect={setFile} 
            selectedFile={file} 
          />
        </div>

        {/* Documentation URLs */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={iconContainerStyle('linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)')}>
              🌐
            </div>
            <div>
              <h3 style={titleStyle}>Documentation Links</h3>
              <p style={subtitleStyle}>Additional context for analysis</p>
            </div>
          </div>
          <DocumentationInput 
            urls={docUrls} 
            onChange={setDocUrls} 
          />
        </div>

        {/* Analysis Control Panel */}
        <div style={controlPanelStyle}>
          <div style={{
            width: '4rem',
            height: '4rem',
            margin: '0 auto 1.5rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🧠
          </div>
          
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#fafafa',
            marginBottom: '0.5rem'
          }}>
            AI Document Analyzer
          </h3>
          
          <p style={{
            fontSize: '0.875rem',
            color: '#a1a1aa',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>
            Get structured analysis with automatic categorization and insights extraction
          </p>

          {/* Features */}
          <div style={featureListStyle}>
            {[
              { icon: '⚡', text: 'Claude AI Analysis', color: '#3b82f6' },
              { icon: '📊', text: 'Structured Output', color: '#8b5cf6' },
              { icon: '📤', text: 'Notion Integration', color: '#f59e0b' }
            ].map((feature, index) => (
              <div key={index} style={featureItemStyle}>
                <span style={featureIconStyle(feature.color)}>
                  {feature.icon}
                </span>
                <span style={featureTextStyle}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isReady}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (isReady) {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = 'scale(1.02)';
                target.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (isReady) {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = 'scale(1)';
                target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
              }
            }}
          >
            {(!status || status.stage === 'completed' || status.stage === 'error') && (
              <span>🚀 Start Analysis</span>
            )}
            {status && status.stage !== 'completed' && status.stage !== 'error' && (
              <span>⏳ Processing...</span>
            )}
          </button>

          {/* File Info */}
          {file && (
            <div style={fileInfoStyle}>
              <div style={infoRowStyle}>
                <span style={infoLabelStyle}>Selected file:</span>
                <span style={infoValueStyle}>{file.name}</span>
              </div>
              <div style={infoRowStyle}>
                <span style={infoLabelStyle}>Size:</span>
                <span style={infoValueStyle}>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              {docUrls.length > 0 && (
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Context URLs:</span>
                  <span style={infoValueStyle}>{docUrls.length}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {status && status.stage !== 'completed' && (
        <div style={statusCardStyle}>
          <ProcessingStatus status={status} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={statusCardStyle}>
          <AnalysisResultView result={result} />
        </div>
      )}
    </div>
  );
} 