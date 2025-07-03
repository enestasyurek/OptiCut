import { useState } from 'react';
import { 
  CheckCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export function OptimizationView({ sheets, statistics }) {
  const [selectedSheet, setSelectedSheet] = useState(0);

  if (!sheets || !statistics) {
    return <div>Veriler yükleniyor...</div>;
  }

  const currentSheet = sheets[selectedSheet] || sheets[0];

  const mainStats = [
    { label: 'Toplam Levha', value: statistics.totalSheets },
    { label: 'Verimlilik', value: `%${statistics.overallEfficiency.toFixed(1)}` },
    { label: 'Toplam Fire', value: `${(statistics.totalWasteArea / 1000000).toFixed(2)} m²` },
    { label: 'Fire Oranı', value: `%${((statistics.totalWasteArea / statistics.totalSheetArea) * 100).toFixed(1)}` }
  ];

  return (
    <div className="animate-slideUp">
      {/* Header */}
      <div className="text-center mb-xl">
        <div className="flex justify-center mb-md">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,204,136,0.1)] flex items-center justify-center">
            <CheckCircleIcon className="icon-lg text-success" />
          </div>
        </div>
        <h1 className="text-3xl font-thin mb-sm">
          Optimizasyon Tamamlandı
        </h1>
        <p className="text-secondary">
          {statistics.totalPieces} parça, {statistics.totalSheets} levhaya yerleştirildi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
        {mainStats.map((stat) => (
          <div key={stat.label} className="surface rounded-lg p-md text-center">
            <div className="text-2xl font-light text-primary mb-xs">
              {stat.value}
            </div>
            <div className="text-sm text-secondary">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-sm mb-xl">
        <button className="btn btn-primary">
          <ArrowDownTrayIcon className="icon-sm" />
          <span>İndir</span>
        </button>
        <button className="btn btn-secondary">
          <PrinterIcon className="icon-sm" />
          <span>Yazdır</span>
        </button>
        <button className="btn btn-secondary">
          <ShareIcon className="icon-sm" />
          <span>Paylaş</span>
        </button>
      </div>

      {/* Sheet Visualization */}
      <div className="grid lg:grid-cols-3 gap-lg">
        {/* Sheet List */}
        <div className="lg:col-span-1">
          <div className="surface rounded-xl p-md">
            <h3 className="text-lg font-medium mb-md">Levhalar</h3>
            <div className="space-y-sm max-h-96 overflow-y-auto">
              {sheets.map((sheet, index) => (
                <button
                  key={sheet.id}
                  onClick={() => setSelectedSheet(index)}
                  className={`
                    w-full text-left p-md rounded-lg border transition-all
                    ${selectedSheet === index
                      ? 'border-[var(--color-accent)] bg-[rgba(0,102,255,0.05)]'
                      : 'border-[var(--color-border)] hover:border-[rgba(0,0,0,0.1)]'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-xs">
                    <span className="font-medium">Levha #{sheet.id}</span>
                    <span className={`
                      text-sm font-medium
                      ${sheet.efficiency >= 90 ? 'text-success' : 
                        sheet.efficiency >= 80 ? 'text-warning' : 'text-error'}
                    `}>
                      %{sheet.efficiency.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm text-secondary">
                    {sheet.pieces.length} parça • {(sheet.usedArea / 1000000).toFixed(2)} m²
                  </div>
                  <div className="mt-sm">
                    <div className="progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${sheet.efficiency}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sheet Preview */}
        <div className="lg:col-span-2">
          <div className="surface rounded-xl p-md">
            <div className="flex justify-between items-center mb-md">
              <h3 className="text-lg font-medium">
                Levha #{currentSheet?.id} - Kesim Planı
              </h3>
              <div className={`
                badge
                ${currentSheet?.efficiency >= 90 ? 'badge-success' : 
                  currentSheet?.efficiency >= 80 ? 'badge-warning' : 'badge-error'}
              `}>
                %{currentSheet?.efficiency.toFixed(1)} Verimlilik
              </div>
            </div>
            
            {/* Sheet Visual */}
            <div className="relative bg-[var(--color-border)] rounded-lg overflow-hidden" 
                 style={{ aspectRatio: '6000/3210' }}>
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              />
              
              {/* Pieces */}
              <div className="absolute inset-0">
                {currentSheet?.pieces.map((piece, index) => {
                  const colors = [
                    'rgba(0, 102, 255, 0.7)',  // Blue
                    'rgba(147, 51, 234, 0.7)', // Purple
                    'rgba(16, 185, 129, 0.7)', // Green
                    'rgba(236, 72, 153, 0.7)', // Pink
                    'rgba(245, 158, 11, 0.7)', // Orange
                    'rgba(239, 68, 68, 0.7)',  // Red
                    'rgba(59, 130, 246, 0.7)', // Light Blue
                    'rgba(99, 102, 241, 0.7)', // Indigo
                  ];
                  
                  return (
                    <div
                      key={`${piece.id}-${index}`}
                      className="absolute border border-white/50 flex items-center justify-center text-white text-xs font-medium shadow-sm hover:z-10 hover:shadow-lg transition-all cursor-pointer"
                      style={{
                        left: `${(piece.x / 6000) * 100}%`,
                        top: `${(piece.y / 3210) * 100}%`,
                        width: `${(piece.width / 6000) * 100}%`,
                        height: `${(piece.height / 3210) * 100}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                      title={`Parça ${piece.id}: ${piece.width}×${piece.height}mm`}
                    >
                      <span className="drop-shadow">
                        {piece.width} × {piece.height}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Dimensions */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                6000 × 3210 mm
              </div>
            </div>
            
            {/* Sheet Details */}
            <div className="grid grid-cols-3 gap-sm mt-md">
              <div className="text-center p-sm rounded-lg bg-[var(--color-border)]">
                <div className="text-lg font-medium">
                  {currentSheet?.pieces.length}
                </div>
                <div className="text-xs text-secondary">Parça</div>
              </div>
              <div className="text-center p-sm rounded-lg bg-[var(--color-border)]">
                <div className="text-lg font-medium">
                  {((currentSheet?.usedArea || 0) / 1000000).toFixed(2)} m²
                </div>
                <div className="text-xs text-secondary">Kullanılan</div>
              </div>
              <div className="text-center p-sm rounded-lg bg-[var(--color-border)]">
                <div className="text-lg font-medium">
                  {(((currentSheet?.totalArea || 0) - (currentSheet?.usedArea || 0)) / 1000000).toFixed(2)} m²
                </div>
                <div className="text-xs text-secondary">Fire</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-xl surface rounded-xl p-lg text-center">
        <ChartBarIcon className="icon-xl text-success mx-auto mb-md" />
        <h3 className="text-xl font-medium mb-sm">Özet</h3>
        <p className="text-secondary max-w-2xl mx-auto">
          Optimizasyon başarıyla tamamlandı. {statistics.totalPieces} parça, 
          {' '}{statistics.totalSheets} levhaya %{statistics.overallEfficiency.toFixed(1)} verimlilikle yerleştirildi. 
          Toplam fire miktarı {(statistics.totalWasteArea / 1000000).toFixed(2)} m² 
          (%{((statistics.totalWasteArea / statistics.totalSheetArea) * 100).toFixed(1)}).
        </p>
      </div>
    </div>
  );
}