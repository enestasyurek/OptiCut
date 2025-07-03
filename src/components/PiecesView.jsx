import { useState } from 'react';
import { 
  RocketLaunchIcon,
  CubeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export function PiecesView({ pieces, onOptimize, isOptimizing }) {
  const [selectedPieces, setSelectedPieces] = useState([]);
  
  const totalPieces = pieces.reduce((sum, piece) => sum + piece.quantity, 0);
  const totalArea = pieces.reduce((sum, piece) => sum + (piece.width * piece.height * piece.quantity), 0);
  const estimatedSheets = Math.ceil(totalArea / (6000 * 3210));

  const togglePieceSelection = (pieceId) => {
    setSelectedPieces(prev => 
      prev.includes(pieceId) 
        ? prev.filter(id => id !== pieceId)
        : [...prev, pieceId]
    );
  };

  const stats = [
    { label: 'Parça Tipi', value: pieces.length },
    { label: 'Toplam Adet', value: totalPieces },
    { label: 'Toplam Alan', value: `${(totalArea / 1000000).toFixed(1)} m²` },
    { label: 'Tahmini Levha', value: estimatedSheets }
  ];

  return (
    <div className="animate-slideUp">
      {/* Header */}
      <div className="text-center mb-xl">
        <h1 className="text-3xl font-thin mb-sm">
          {pieces.length} Parça Tespit Edildi
        </h1>
        <p className="text-secondary">
          PDF dosyanızdan başarıyla parça bilgileri çıkarıldı
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
        {stats.map((stat) => (
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

      {/* Optimize Button */}
      <div className="flex justify-center mb-xl">
        <button
          onClick={onOptimize}
          disabled={isOptimizing || pieces.length === 0}
          className="btn btn-primary btn-lg"
        >
          {isOptimizing ? (
            <>
              <div className="loading"></div>
              <span>Optimizasyon yapılıyor...</span>
            </>
          ) : (
            <>
              <RocketLaunchIcon className="icon-md" />
              <span>Optimizasyonu Başlat</span>
            </>
          )}
        </button>
      </div>

      {/* Pieces List */}
      <div className="surface rounded-xl p-lg">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-lg font-medium">Parça Listesi</h3>
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setSelectedPieces(pieces.map(p => p.id))}
              className="btn btn-ghost btn-sm"
            >
              Tümünü Seç
            </button>
            <button
              onClick={() => setSelectedPieces([])}
              className="btn btn-ghost btn-sm"
            >
              Temizle
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-b-[var(--color-border)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary">
                  <input
                    type="checkbox"
                    checked={selectedPieces.length === pieces.length}
                    onChange={() => {
                      if (selectedPieces.length === pieces.length) {
                        setSelectedPieces([]);
                      } else {
                        setSelectedPieces(pieces.map(p => p.id));
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Boyut (mm)</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-secondary">Adet</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-secondary">Alan (m²)</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary">Kaynak</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((piece, index) => (
                <tr
                  key={piece.id}
                  className={`
                    border-b border-b-[var(--color-border)] cursor-pointer
                    hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)]
                    ${selectedPieces.includes(piece.id) ? 'bg-[rgba(0,102,255,0.05)]' : ''}
                  `}
                  onClick={() => togglePieceSelection(piece.id)}
                >
                  <td className="py-3 px-4">
                    <div className={`
                      w-5 h-5 rounded border transition-all
                      ${selectedPieces.includes(piece.id)
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                        : 'border-[var(--color-border)]'
                      }
                      flex items-center justify-center
                    `}>
                      {selectedPieces.includes(piece.id) && (
                        <CheckIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    #{piece.id}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {piece.width} × {piece.height}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium">
                    {piece.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-secondary">
                    {((piece.width * piece.height * piece.quantity) / 1000000).toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-sm text-secondary truncate max-w-[150px]" title={piece.sourceFile}>
                    {piece.sourceFile || 'PDF'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="py-3 px-4 text-sm font-medium">
                  Toplam
                </td>
                <td className="py-3 px-4 text-sm text-right font-bold">
                  {totalPieces}
                </td>
                <td className="py-3 px-4 text-sm text-right font-bold">
                  {(totalArea / 1000000).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}