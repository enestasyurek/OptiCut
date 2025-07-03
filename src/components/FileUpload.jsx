import { useState, useRef } from 'react';
import { 
  DocumentArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function FileUpload({ onFileUpload, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleFile = (file) => {
    setFile(file);
    onFileUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-xl">
          <h1 className="text-3xl font-thin mb-sm">
            PDF Dosyanızı Yükleyin
          </h1>
          <p className="text-secondary">
            Sipariş listesi PDF dosyanızı yükleyerek başlayın
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!isLoading ? handleClick : undefined}
          className={`
            surface rounded-xl p-xl text-center cursor-pointer
            transition-all duration-300
            ${isDragOver ? 'border-[var(--color-accent)] bg-[rgba(0,102,255,0.02)]' : ''}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[rgba(0,0,0,0.1)]'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />

          {isLoading ? (
            <div className="flex flex-col items-center gap-md">
              <div className="loading"></div>
              <p className="text-secondary">PDF dosyası analiz ediliyor...</p>
              <div className="flex flex-col gap-xs text-sm text-tertiary">
                <span>• Tablolar tespit ediliyor</span>
                <span>• Parça bilgileri çıkarılıyor</span>
                <span>• Veriler işleniyor</span>
              </div>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-md">
              <div className="w-16 h-16 rounded-full bg-[rgba(0,204,136,0.1)] flex items-center justify-center">
                <CheckCircleIcon className="icon-lg text-success" />
              </div>
              <div>
                <p className="font-medium text-primary">{file.name}</p>
                <p className="text-sm text-tertiary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <p className="text-sm text-secondary">
                Dosya başarıyla yüklendi
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-md">
              <div className={`
                w-20 h-20 rounded-full transition-all duration-300
                ${isDragOver ? 'bg-[rgba(0,102,255,0.1)] scale-110' : 'bg-[var(--color-border)]'}
                flex items-center justify-center
              `}>
                <DocumentArrowUpIcon className={`
                  icon-xl transition-all duration-300
                  ${isDragOver ? 'text-accent scale-110' : 'text-tertiary'}
                `} />
              </div>
              
              <div>
                <p className="font-medium text-primary mb-xs">
                  {isDragOver ? 'Dosyayı bırakın' : 'PDF dosyanızı sürükleyin'}
                </p>
                <p className="text-sm text-tertiary">
                  veya <span className="text-accent">tıklayarak seçin</span>
                </p>
              </div>

              <div className="mt-md pt-md border-t border-t-[var(--color-border)] w-full max-w-xs">
                <p className="text-xs text-tertiary text-center">
                  Sadece PDF formatı desteklenir • Maksimum 50MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Example Files */}
        <div className="mt-xl">
          <h3 className="text-sm font-medium text-secondary mb-md">
            Örnek Dosyalar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <button className="surface rounded-md p-md flex items-center gap-sm hover:border-[rgba(0,0,0,0.1)] text-left">
              <DocumentTextIcon className="icon-md text-tertiary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sipariş Listesi</p>
                <p className="text-xs text-tertiary">Örnek PDF</p>
              </div>
            </button>
            <button className="surface rounded-md p-md flex items-center gap-sm hover:border-[rgba(0,0,0,0.1)] text-left">
              <DocumentTextIcon className="icon-md text-tertiary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Kesim Planı</p>
                <p className="text-xs text-tertiary">Örnek PDF</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}