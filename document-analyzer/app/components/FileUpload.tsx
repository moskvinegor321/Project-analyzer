"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, FileText, Image } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setIsDragOver(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false)
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'docx':
        return <File className="w-5 h-5 text-blue-400" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (selectedFile) {
    return (
      <div className="relative group">
        {/* Selected file display - KATALOG style */}
        <div className="bg-muted/20 border border-border/50 rounded-lg p-4 transition-all duration-200 group-hover:bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-card border border-border/30 flex items-center justify-center">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-foreground truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="font-heading-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <span className="font-heading-xs text-status-success">
                    • Ready for analysis
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => onFileSelect(null)}
              className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 border-0 p-0 transition-colors"
            >
              <X className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Upload area - KATALOG sophisticated design */}
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragActive || isDragOver 
            ? 'border-media-movie/50 bg-media-movie/5' 
            : 'border-border/30 hover:border-border/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/5 via-transparent to-accent/5" />
        
        {/* Content */}
        <div className="relative p-8 text-center space-y-4">
          {/* Upload icon with animated background */}
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className={`
              absolute inset-0 rounded-2xl transition-all duration-300
              ${isDragActive || isDragOver 
                ? 'bg-media-movie/20 scale-110' 
                : 'bg-muted/20 hover:bg-muted/30'
              }
            `} />
            <div className="relative w-full h-full rounded-2xl flex items-center justify-center">
              <Upload className={`
                w-8 h-8 transition-all duration-300
                ${isDragActive || isDragOver 
                  ? 'text-media-movie scale-110' 
                  : 'text-muted-foreground'
                }
              `} />
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-2">
            <h4 className="font-heading text-foreground">
              {isDragActive ? 'Drop your file here' : 'Upload Document'}
            </h4>
            <p className="font-heading-xs text-muted-foreground">
              Drag and drop your file here, or click to browse
            </p>
          </div>

          {/* File format indicators */}
          <div className="flex items-center justify-center space-x-4 pt-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/30">
              <FileText className="w-4 h-4 text-red-400" />
              <span className="font-heading-xs text-muted-foreground">PDF</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/30">
              <File className="w-4 h-4 text-blue-400" />
              <span className="font-heading-xs text-muted-foreground">DOCX</span>
            </div>
          </div>

          {/* Size limit */}
          <p className="font-heading-xs text-muted-foreground/60 pt-2">
            Max 50MB
          </p>
        </div>

        {/* Animated border on drag */}
        {(isDragActive || isDragOver) && (
          <div className="absolute inset-0 rounded-lg border-2 border-media-movie/30 animate-pulse" />
        )}
      </div>
    </div>
  );
} 