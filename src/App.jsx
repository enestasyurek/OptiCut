import { useState, useEffect } from 'react';
import { parsePdfFile } from './utils/pdfParser';
import { optimizePieces } from './utils/advancedOptimizer';
import { Navigation } from './components/Navigation';
import { FileUpload } from './components/FileUpload';
import { PiecesView } from './components/PiecesView';
import { OptimizationView } from './components/OptimizationView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { FloatingStats } from './components/FloatingStats';

function App() {
  const [currentStep, setCurrentStep] = useState('upload');
  const [pieces, setPieces] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = async (files) => {
    if (files.length === 0) {
      setPieces([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const allPieces = [];
      let pieceIdCounter = 1;
      
      for (const file of files) {
        try {
          const extractedPieces = await parsePdfFile(file);
          // Add unique IDs and source file info to pieces
          const piecesWithFileInfo = extractedPieces.map(piece => ({
            ...piece,
            id: pieceIdCounter++,
            sourceFile: file.name
          }));
          allPieces.push(...piecesWithFileInfo);
        } catch (error) {
          console.error(`Error parsing ${file.name}:`, error);
        }
      }
      
      if (allPieces.length > 0) {
        setPieces(allPieces);
        setCurrentStep('pieces');
      } else {
        alert('Yüklenen PDF dosyalarından parça bilgisi çıkarılamadı. Lütfen geçerli sipariş listesi PDF\'leri yüklediğinizden emin olun.');
      }
    } catch (error) {
      console.error('Error parsing PDFs:', error);
      alert('PDF dosyaları işlenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const optimizedSheets = optimizePieces(pieces);
      setSheets(optimizedSheets);
      
      const stats = calculateStatistics(optimizedSheets);
      setStatistics(stats);
      
      setCurrentStep('results');
    } catch (error) {
      console.error('Error during optimization:', error);
      alert('Optimizasyon sırasında bir hata oluştu.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const calculateStatistics = (sheets) => {
    const sheetSize = { width: 6000, height: 3210 };
    const totalSheetArea = sheetSize.width * sheetSize.height * sheets.length;
    const totalUsedArea = sheets.reduce((sum, sheet) => sum + sheet.usedArea, 0);
    const totalWasteArea = totalSheetArea - totalUsedArea;
    const overallEfficiency = (totalUsedArea / totalSheetArea) * 100;
    const totalPieces = sheets.reduce((sum, sheet) => sum + sheet.pieces.length, 0);
    const totalArea = pieces.reduce((sum, piece) => sum + (piece.width * piece.height * piece.quantity), 0);

    return {
      totalSheets: sheets.length,
      totalPieces,
      totalArea,
      totalSheetArea,
      totalUsedArea,
      totalWasteArea,
      overallEfficiency,
      sheets
    };
  };

  const handleBack = () => {
    if (currentStep === 'pieces') {
      setCurrentStep('upload');
    } else if (currentStep === 'results') {
      setCurrentStep('pieces');
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setPieces([]);
    setSheets([]);
    setStatistics(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation 
        currentStep={currentStep}
        onBack={handleBack}
        onReset={handleReset}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <main className="flex-1 container mt-xl mb-xl">
        {currentStep === 'upload' && (
          <div className="animate-slideUp">
            <FileUpload 
              onFileUpload={handleFileUpload} 
              isLoading={isLoading}
            />
          </div>
        )}
        
        {currentStep === 'pieces' && (
          <div className="animate-slideUp">
            <PiecesView 
              pieces={pieces}
              onOptimize={handleOptimize}
              isOptimizing={isOptimizing}
            />
          </div>
        )}
        
        {currentStep === 'results' && (
          <div className="animate-slideUp">
            <OptimizationView 
              sheets={sheets}
              statistics={statistics}
            />
          </div>
        )}
      </main>
      
      {statistics && currentStep === 'results' && (
        <FloatingStats 
          statistics={statistics}
        />
      )}
      
      {(isLoading || isOptimizing) && (
        <LoadingOverlay 
          isOptimizing={isOptimizing}
          message={isOptimizing ? 'Optimizasyon yapılıyor...' : 'PDF analiz ediliyor...'}
        />
      )}
    </div>
  );
}

export default App;