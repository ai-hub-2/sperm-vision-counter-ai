import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  isProcessing
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = Array.from(e.dataTransfer.files);
      const validFile = files.find(file => 
        file.type.startsWith('video/') || file.type.startsWith('image/')
      );
      
      if (validFile) {
        onFileSelect(validFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const clearFile = () => {
    onFileSelect(null as any);
  };

  return (
    <Card className="p-8">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
          isDragOver ? "border-primary bg-primary/5" : "border-border",
          selectedFile ? "border-accent bg-accent/5" : "",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-accent/20">
              {selectedFile.type.startsWith('video/') ? (
                <FileVideo className="w-8 h-8 text-accent" />
              ) : (
                <Image className="w-8 h-8 text-accent" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">{selectedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearFile}
              disabled={isProcessing}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Media for Analysis
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your video or image file, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: MP4, AVI, JPG, PNG
              </p>
            </div>
            
            <div>
              <input
                type="file"
                accept="video/*,image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="medical" size="lg" className="cursor-pointer">
                  Select File
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};