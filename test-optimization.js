import { optimizePieces } from './src/utils/advancedOptimizer.js';

// Test senaryoları
const testCases = [
  {
    name: "Basit Test - Aynı Boyutlar",
    pieces: [
      { id: 1, width: 1000, height: 1000, quantity: 5 },
      { id: 2, width: 1000, height: 1000, quantity: 5 }
    ]
  },
  {
    name: "Karışık Boyutlar",
    pieces: [
      { id: 1, width: 2000, height: 1500, quantity: 3 },
      { id: 2, width: 1000, height: 800, quantity: 5 },
      { id: 3, width: 500, height: 500, quantity: 8 },
      { id: 4, width: 1500, height: 1200, quantity: 4 }
    ]
  },
  {
    name: "Büyük Parçalar",
    pieces: [
      { id: 1, width: 3000, height: 2000, quantity: 2 },
      { id: 2, width: 2500, height: 1800, quantity: 3 },
      { id: 3, width: 1000, height: 1000, quantity: 10 }
    ]
  }
];

console.log("OptiCut Gelişmiş Optimizasyon Testi\n");
console.log("=====================================\n");

testCases.forEach(testCase => {
  console.log(`\n📋 ${testCase.name}`);
  console.log("-".repeat(40));
  
  const sheets = optimizePieces(testCase.pieces);
  
  const totalPieces = testCase.pieces.reduce((sum, p) => sum + p.quantity, 0);
  const totalRequestedArea = testCase.pieces.reduce((sum, p) => sum + (p.width * p.height * p.quantity), 0);
  const totalSheetArea = sheets.reduce((sum, s) => sum + s.totalArea, 0);
  const totalUsedArea = sheets.reduce((sum, s) => sum + s.usedArea, 0);
  const overallEfficiency = (totalUsedArea / totalSheetArea) * 100;
  
  console.log(`✅ Toplam parça sayısı: ${totalPieces}`);
  console.log(`📐 Talep edilen alan: ${(totalRequestedArea / 1000000).toFixed(2)} m²`);
  console.log(`📄 Kullanılan levha sayısı: ${sheets.length}`);
  console.log(`📊 Genel verimlilik: %${overallEfficiency.toFixed(1)}`);
  console.log(`🗑️ Toplam fire: ${((totalSheetArea - totalUsedArea) / 1000000).toFixed(2)} m²`);
  
  console.log("\nLevha Detayları:");
  sheets.forEach(sheet => {
    console.log(`  Levha #${sheet.id}: ${sheet.pieces.length} parça, %${sheet.efficiency.toFixed(1)} verimlilik`);
  });
});

console.log("\n\n✨ Optimizasyon Özellikleri:");
console.log("- Parçaları döndürme yeteneği");
console.log("- Gelişmiş alan yönetimi (free space tracking)");
console.log("- En iyi yerleştirme algoritması");
console.log("- Boş alanları birleştirme");
console.log("- Minimum fire hedefi");