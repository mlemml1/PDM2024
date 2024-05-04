
class CellBlock {
  constructor(width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.grid = Array.from({length: width * height}, (val, index) => false);
  }

  Set(x, y) {
    this.grid[y * this.width + x] = true;
  }

  Get(x, y) {
    return this.grid[y * this.width + x];
  }

  Rotate(n) {
    // Only supported on square shapes.
    if (this.width != this.height)
      return;
    
    for (let rot = 0; rot < n; rot++)
    {
      let newGrid = Array.from({length: this.width * this.height}, (val, index) => false);

      for (let y = 0; y < this.height; y++)
      {
        for (let x = 0; x < this.width; x++)
        {
          if (this.grid[y * this.width + x] === true)
          {
            newGrid[x * this.width + (this.height - y - 1)] = true;
          }
        }
      }
  
      this.grid = newGrid;
    }
  }
}

  
// Piece table. Precached data about piece positions.
let pieceTable;

function createPiece(type) {
  // https://tetris.fandom.com/wiki/SRS
  let block;
  if (type == PC_I)
  {
    block = new CellBlock(4, 4, COL_CYN);
    block.Set(0, 1);
    block.Set(1, 1);
    block.Set(2, 1);
    block.Set(3, 1);
  }
  else if (type == PC_J)
  {
    block = new CellBlock(3, 3, COL_BLU);
    block.Set(0, 0);
    block.Set(0, 1);
    block.Set(1, 1);
    block.Set(2, 1);
  }
  else if (type == PC_L)
  {
    block = new CellBlock(3, 3, COL_ORG);
    block.Set(2, 0);
    block.Set(0, 1);
    block.Set(1, 1);
    block.Set(2, 1);
  }
  else if (type == PC_O)
  {
    block = new CellBlock(4, 3, COL_YLW);
    block.Set(1, 0);
    block.Set(2, 0);
    block.Set(1, 1);
    block.Set(2, 1);
  }
  else if (type == PC_S)
  {
    block = new CellBlock(3, 3, COL_GRN);
    block.Set(1, 0);
    block.Set(2, 0);
    block.Set(0, 1);
    block.Set(1, 1);
  }
  else if (type == PC_T)
  {
    block = new CellBlock(3, 3, COL_MGA);
    block.Set(1, 0);
    block.Set(0, 1);
    block.Set(1, 1);
    block.Set(2, 1);
  }
  else if (type == PC_Z)
  {
    block = new CellBlock(3, 3, COL_RED);
    block.Set(0, 0);
    block.Set(1, 0);
    block.Set(1, 1);
    block.Set(2, 1);
  }
  else
  {
    return null;
  }

  return block;
}

function initPieceTable()
{
  pieceTable = [];

  for (let pc = 0; pc < 7; pc++)
  {
    for (let rot = 0; rot < 4; rot++)
    {
      let blk = createPiece(pc);

      // O piece has no rotation.
      if (pc != PC_O)
        blk.Rotate(rot);
      
      pieceTable.push(blk);
    }
  }
}
initPieceTable();

function getPiece(piece, rot)
{
  if (piece < 0 || piece > 6 || rot < 0 || rot > 3)
    return null;
  
  return pieceTable[piece * 4 + rot];
}
