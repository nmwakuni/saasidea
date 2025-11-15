'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload?: (file: File) => Promise<void>;
  acceptedFormats?: string[];
  maxSize?: number; // in bytes
}

export function FileUpload({
  onUpload,
  acceptedFormats = ['video/*', 'audio/*'],
  maxSize = 500 * 1024 * 1024, // 500MB default
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      setUploadedFile(file);
      setUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress (replace with real upload logic)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 300);

        if (onUpload) {
          await onUpload(file);
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setUploadedFile(null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (uploadedFile && uploadProgress === 100) {
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Upload complete!</p>
              <p className="text-sm text-green-700 mt-1">{uploadedFile.name}</p>
              <p className="text-xs text-green-600 mt-0.5">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Uploading...</p>
                <p className="text-sm text-blue-700">{uploadedFile?.name}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-900">
              {uploadProgress}%
            </span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'rounded-lg border-2 border-dashed p-12 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
          error && 'border-red-300 bg-red-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            'mx-auto h-12 w-12 mb-4',
            isDragActive ? 'text-blue-500' : 'text-gray-400',
            error && 'text-red-400'
          )}
        />
        {error ? (
          <>
            <p className="text-lg font-medium text-red-900 mb-2">
              Upload failed
            </p>
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={removeFile}
              className="mt-4"
            >
              Try again
            </Button>
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive
                ? 'Drop your file here'
                : 'Drag and drop your file here'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-gray-500">
              Supports video and audio files up to {formatFileSize(maxSize)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
