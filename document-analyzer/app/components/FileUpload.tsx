"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Upload, FileText, X, File, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <File className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">Загрузите документ</h3>
      </div>
      
      <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div
          {...getRootProps()}
          className={`relative overflow-hidden rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-400 scale-105' 
              : 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 border-2 border-dashed border-slate-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
          
          {selectedFile ? (
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold text-slate-800 text-lg">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                  Файл готов к анализу
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null);
                }}
                className="mt-4 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Удалить файл
              </Button>
            </div>
          ) : (
            <div className="relative z-10 space-y-6">
              <div className="flex justify-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDragActive 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 scale-110' 
                    : 'bg-gradient-to-br from-slate-200 to-slate-300'
                }`}>
                  <Upload className={`w-10 h-10 transition-colors duration-300 ${
                    isDragActive ? 'text-white' : 'text-slate-600'
                  }`} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-slate-800">
                  {isDragActive ? 'Отпустите файл здесь' : 'Перетащите файл сюда'}
                </h4>
                <p className="text-slate-600">
                  или нажмите для выбора файла
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    .PDF
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                    .DOCX
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                    до 50MB
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 