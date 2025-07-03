export const optimizePieces = (pieces, sheetSize = { width: 6000, height: 3210 }) => {
  const GAP = 5;
  const expandedPieces = [];
  
  pieces.forEach(piece => {
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({
        ...piece,
        id: `${piece.id}-${i}`,
        originalId: piece.id,
        area: piece.width * piece.height
      });
    }
  });

  expandedPieces.sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });

  const sheets = [];
  const unplacedPieces = [...expandedPieces];

  while (unplacedPieces.length > 0) {
    const sheet = {
      id: sheets.length + 1,
      width: sheetSize.width,
      height: sheetSize.height,
      pieces: [],
      freeSpaces: [{
        x: 0,
        y: 0,
        width: sheetSize.width,
        height: sheetSize.height
      }],
      usedArea: 0,
      totalArea: sheetSize.width * sheetSize.height
    };

    let placedInThisSheet = true;
    while (placedInThisSheet && unplacedPieces.length > 0) {
      placedInThisSheet = false;
      
      for (let i = 0; i < unplacedPieces.length; i++) {
        const piece = unplacedPieces[i];
        const rotations = [
          { width: piece.width, height: piece.height, rotated: false },
          { width: piece.height, height: piece.width, rotated: true }
        ];

        let placed = false;
        for (const rotation of rotations) {
          const placement = findBestPlacement(sheet, rotation.width, rotation.height, GAP);
          
          if (placement) {
            const placedPiece = {
              ...piece,
              x: placement.x,
              y: placement.y,
              width: rotation.width,
              height: rotation.height,
              rotated: rotation.rotated
            };
            
            sheet.pieces.push(placedPiece);
            sheet.usedArea += rotation.width * rotation.height;
            updateFreeSpaces(sheet, placedPiece, GAP);
            
            unplacedPieces.splice(i, 1);
            placedInThisSheet = true;
            placed = true;
            break;
          }
        }
        
        if (placed) break;
      }
    }

    if (sheet.pieces.length > 0) {
      sheet.efficiency = (sheet.usedArea / sheet.totalArea) * 100;
      sheets.push(sheet);
    }
  }

  return sheets;
};

function findBestPlacement(sheet, pieceWidth, pieceHeight, gap) {
  let bestPlacement = null;
  let minWaste = Infinity;

  sheet.freeSpaces.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  for (const space of sheet.freeSpaces) {
    if (space.width >= pieceWidth + gap && space.height >= pieceHeight + gap) {
      const remainingWidth = space.width - pieceWidth - gap;
      const remainingHeight = space.height - pieceHeight - gap;
      const waste = remainingWidth * remainingHeight;

      if (waste < minWaste) {
        minWaste = waste;
        bestPlacement = {
          x: space.x,
          y: space.y,
          spaceIndex: sheet.freeSpaces.indexOf(space)
        };
      }
    }
  }

  return bestPlacement;
}

function updateFreeSpaces(sheet, placedPiece, gap) {
  const newFreeSpaces = [];
  
  for (const space of sheet.freeSpaces) {
    if (isOverlapping(space, placedPiece, gap)) {
      const fragments = fragmentSpace(space, placedPiece, gap);
      newFreeSpaces.push(...fragments.filter(f => f.width > 0 && f.height > 0));
    } else {
      newFreeSpaces.push(space);
    }
  }

  newFreeSpaces.sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });

  const mergedSpaces = [];
  const used = new Array(newFreeSpaces.length).fill(false);

  for (let i = 0; i < newFreeSpaces.length; i++) {
    if (used[i]) continue;
    
    let current = { ...newFreeSpaces[i] };
    let merged = true;
    
    while (merged) {
      merged = false;
      for (let j = i + 1; j < newFreeSpaces.length; j++) {
        if (used[j]) continue;
        
        const other = newFreeSpaces[j];
        if (canMerge(current, other)) {
          current = merge(current, other);
          used[j] = true;
          merged = true;
        }
      }
    }
    
    mergedSpaces.push(current);
  }

  sheet.freeSpaces = mergedSpaces.filter(space => 
    space.width >= 100 && space.height >= 100
  );
}

function isOverlapping(space, piece, gap) {
  return !(piece.x >= space.x + space.width ||
           piece.x + piece.width + gap <= space.x ||
           piece.y >= space.y + space.height ||
           piece.y + piece.height + gap <= space.y);
}

function fragmentSpace(space, piece, gap) {
  const fragments = [];
  const pieceRight = piece.x + piece.width + gap;
  const pieceBottom = piece.y + piece.height + gap;

  if (piece.y > space.y) {
    fragments.push({
      x: space.x,
      y: space.y,
      width: space.width,
      height: piece.y - space.y
    });
  }

  if (pieceBottom < space.y + space.height) {
    fragments.push({
      x: space.x,
      y: pieceBottom,
      width: space.width,
      height: space.y + space.height - pieceBottom
    });
  }

  if (piece.x > space.x) {
    fragments.push({
      x: space.x,
      y: Math.max(space.y, piece.y),
      width: piece.x - space.x,
      height: Math.min(space.y + space.height, pieceBottom) - Math.max(space.y, piece.y)
    });
  }

  if (pieceRight < space.x + space.width) {
    fragments.push({
      x: pieceRight,
      y: Math.max(space.y, piece.y),
      width: space.x + space.width - pieceRight,
      height: Math.min(space.y + space.height, pieceBottom) - Math.max(space.y, piece.y)
    });
  }

  return fragments;
}

function canMerge(a, b) {
  if (a.x === b.x && a.width === b.width) {
    return (a.y + a.height === b.y) || (b.y + b.height === a.y);
  }
  
  if (a.y === b.y && a.height === b.height) {
    return (a.x + a.width === b.x) || (b.x + b.width === a.x);
  }
  
  return false;
}

function merge(a, b) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.max(a.x + a.width, b.x + b.width) - Math.min(a.x, b.x),
    height: Math.max(a.y + a.height, b.y + b.height) - Math.min(a.y, b.y)
  };
}