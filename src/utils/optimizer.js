
/**
 * Simple First‑Fit Decreasing algorithm for 2D bin packing (guillotine cuts).
 * Sheet size defaults to 6000 × 3210 mm.
 * Returns an array of sheets, each sheet has { id, pieces: [{ x, y, width, height }] }.
 */
export function optimizePieces(pieces, sheetWidth = 6000, sheetHeight = 3210) {
  // Flatten quantities into list
  let all = [];
  pieces.forEach(p => {
    for (let i = 0; i < p.qty; i++) {
      all.push({ width: p.width, height: p.height });
    }
  });
  // Sort by max dimension descending
  all.sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height));

  const sheets = [];

  for (const piece of all) {
    let placed = false;
    for (const sheet of sheets) {
      if (placePieceOnSheet(piece, sheet, sheetWidth, sheetHeight)) {
        placed = true;
        break;
      }
    }
    if (!placed) {
      const newSheet = { id: sheets.length + 1, pieces: [] };
      placePieceOnSheet(piece, newSheet, sheetWidth, sheetHeight);
      sheets.push(newSheet);
    }
  }

  return sheets;
}

// Very naive packing: fill along X, then new rows along Y
function placePieceOnSheet(piece, sheet, SW, SH) {
  // try find position
  const gap = 5; // small kerf 5mm
  if (sheet.pieces.length === 0) {
    piece.x = 0;
    piece.y = 0;
    sheet.pieces.push(piece);
    return true;
  }

  // scan positions in grid 
  for (let y = 0; y <= SH - piece.height; y += 10) {
    for (let x = 0; x <= SW - piece.width; x += 10) {
      if (!intersects(x, y, piece.width, piece.height, sheet.pieces, gap)) {
        piece.x = x;
        piece.y = y;
        sheet.pieces.push(piece);
        return true;
      }
    }
  }
  return false;
}

function intersects(x, y, w, h, placed, gap) {
  for (const p of placed) {
    if (x + w + gap <= p.x || x >= p.x + p.width + gap || 
        y + h + gap <= p.y || y >= p.y + p.height + gap) {
      continue;
    }
    return true;
  }
  return false;
}
