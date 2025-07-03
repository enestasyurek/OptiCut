import { useState } from 'react';
import { 
  ChartBarIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export function FloatingStats({ statistics }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!statistics || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-slideUp">
      <div className="surface rounded-xl shadow-lg max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-md border-b border-b-[var(--color-border)]">
          <div className="flex items-center gap-sm">
            <ChartBarIcon className="icon-sm text-secondary" />
            <span className="font-medium">İstatistikler</span>
          </div>
          
          <div className="flex items-center gap-xs">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-ghost btn-sm rounded-full p-1"
              aria-label={isExpanded ? 'Daralt' : 'Genişlet'}
            >
              {isExpanded ? (
                <ChevronDownIcon className="icon-sm" />
              ) : (
                <ChevronUpIcon className="icon-sm" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="btn btn-ghost btn-sm rounded-full p-1"
              aria-label="Kapat"
            >
              <XMarkIcon className="icon-sm" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-md">
          <div className="grid grid-cols-3 gap-md">
            <div className="text-center">
              <div className="text-lg font-medium text-primary">
                {statistics.totalSheets}
              </div>
              <div className="text-xs text-secondary">Levha</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-success">
                %{statistics.overallEfficiency.toFixed(1)}
              </div>
              <div className="text-xs text-secondary">Verimlilik</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-warning">
                %{((statistics.totalWasteArea / statistics.totalSheetArea) * 100).toFixed(1)}
              </div>
              <div className="text-xs text-secondary">Fire</div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-t-[var(--color-border)] p-md space-y-sm animate-slideUp">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Toplam Parça:</span>
              <span className="font-medium">{statistics.totalPieces}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Toplam Alan:</span>
              <span className="font-medium">{(statistics.totalArea / 1000000).toFixed(2)} m²</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Fire Alan:</span>
              <span className="font-medium">{(statistics.totalWasteArea / 1000000).toFixed(2)} m²</span>
            </div>

            {/* Efficiency Bar */}
            <div className="pt-sm">
              <div className="flex justify-between text-xs mb-xs">
                <span className="text-secondary">Verimlilik</span>
                <span className="font-medium text-success">%{statistics.overallEfficiency.toFixed(1)}</span>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${statistics.overallEfficiency}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}