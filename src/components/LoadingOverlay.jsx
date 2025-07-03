export function LoadingOverlay({ isOptimizing, message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="surface rounded-xl p-xl text-center max-w-md animate-scaleIn">
        <div className="loading mx-auto mb-md"></div>
        
        <h3 className="text-xl font-medium mb-sm">
          {isOptimizing ? 'Optimizasyon Yapılıyor' : 'PDF İşleniyor'}
        </h3>
        
        <p className="text-secondary text-sm">
          {message || (isOptimizing 
            ? 'En verimli kesim planı hazırlanıyor...' 
            : 'Dosyanız analiz ediliyor...'
          )}
        </p>
      </div>
    </div>
  );
}