
# OptiCut – Glass Cutting Optimizer

React tabanlı bu uygulama, PDF sipariş dosyalarını okuyup<br/>
6000 mm × 3210 mm cam levhalara minimum fireyle yerleştirir.

## Kurulum

```bash
npm install
npm run dev   # http://localhost:5173
```

## Özellikler
- **PDF Okuma**: `pdfjs-dist` ile metin çıkarımı ve regex tabanlı sipariş parçalama  
- **Optimizasyon**: Basit First‑Fit Decreasing + guillotine yerleştirme  
- **SVG Önizleme**: Her levha üzerindeki parçalar çizimle gösterilir  
- **Tailwind** tasarım, Vite + React 18 yapılandırması  

Geliştirmeye açıktır: farklı levha ölçüsü, daha iyi sezgiseller, Excel/CSV dışa aktarma vb.
