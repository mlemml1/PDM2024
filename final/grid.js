let cellGrid = null;

function getCell(x, y) {
  if (x < 0 || x >= NUM_COLS || y >= NUM_ROWS)
    return COL_WHT;

  // Treat cells over the top as empty.
  if (y < 0)
    return COL_NUL;

  return cellGrid[y * NUM_COLS + x];
}

function setCell(x, y, value)
{
  if (x < 0 || x >= NUM_COLS || y < 0 || y >= NUM_ROWS)
    return;

  cellGrid[y * NUM_COLS + x] = value;
}

function darkenColor(color)
{
  let r = (color >> 16) & 0xFF;
  let g = (color >> 8) & 0xFF;
  let b = color & 0xFF;

  r = round(r * 0.5);
  g = round(g * 0.5);
  b = round(b * 0.5);

  return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
}

// Piece grid logic.
function collapseRowsAbove(n)
{
  // Shift rows above n downward, in place.
  for (let row = n; row >= 0; --row)
  {
    for (let col = 0; col < NUM_COLS; col++)
    {
      setCell(col, row, getCell(col, row - 1));
    }
  }
}

function detachPiece() {
  let piece = getPiece(curPiece, curRotation);

  for (let local_y = 0; local_y < piece.height; local_y++)
  {
    for (let local_x = 0; local_x < piece.width; local_x++)
    {
      if (piece.Get(local_x, local_y))
        setCell(curX + local_x, curY + local_y, COL_NUL);
    }
  }
}

function attachPiece() {
  let piece = getPiece(curPiece, curRotation);

  let color = piece.color;
  if (isPieceAboutToPlace)
  {
    color = darkenColor(color);
  }

  for (let local_y = 0; local_y < piece.height; local_y++)
  {
    for (let local_x = 0; local_x < piece.width; local_x++)
    {
      if (piece.Get(local_x, local_y))
        setCell(curX + local_x, curY + local_y, color);
    }
  }
}

function canFitPieceAt(x, y, piece, rot) {
  let data = getPiece(piece, rot);

  // console.log(`fit piece ${x}, ${y}, ${piece}, ${rot}`);
  for (let local_y = 0; local_y < data.height; local_y++)
  {
    for (let local_x = 0; local_x < data.width; local_x++)
    {
      if (data.Get(local_x, local_y) && getCell(x + local_x, y + local_y) != 0)
        return false;
    }
  }

  return true;
}

function checkPiece(rot, x_offset, y_offset) {
  // flip y offset.
  y_offset *= -1;

  if (canFitPieceAt(curX + x_offset, curY + y_offset, curPiece, rot))
  {
    curX += x_offset;
    curY += y_offset;
    curRotation = rot;
    return true;
  }
  return false;
}

// Attempt to set the piece rotation to the desired state.
function setPieceRotation(rot)
{
  if (curPiece == PC_O)
    return true;
  
  // check basic rotation.
  if (checkPiece(rot, 0, 0))
    return true;

  // Test various rotation/wallkick states.
  if (curPiece == PC_J
    || curPiece == PC_L
    || curPiece == PC_T
    || curPiece == PC_S
    || curPiece == PC_Z)
  {
    if (curRotation == 0)
    {
      if (rot == 1)
      {
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, -1, 1)) return true;
        if (checkPiece(rot, 0, -2)) return true;
        if (checkPiece(rot, -1, -2)) return true;
      }
      else if (rot == 3)
      {
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, 1, 1)) return true;
        if (checkPiece(rot, 0, -2)) return true;
        if (checkPiece(rot, 1, -2)) return true;
      }
    }
    else if (curRotation == 1)
    {
      if (rot == 0)
      {
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, 1, -1)) return true;
        if (checkPiece(rot, 0, 2)) return true;
        if (checkPiece(rot, 1, 2)) return true;
      }
      else if (rot == 2)
      {
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, 1, -1)) return true;
        if (checkPiece(rot, 0, 2)) return true;
        if (checkPiece(rot, 1, 2)) return true;
      }
    }
    else if (curRotation == 2)
    {
      if (rot == 1)
      {
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, -1, 1)) return true;
        if (checkPiece(rot, 0, -2)) return true;
        if (checkPiece(rot, -1, -2)) return true;
      }
      else if (rot == 3)
      {
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, 1, 1)) return true;
        if (checkPiece(rot, 0, -2)) return true;
        if (checkPiece(rot, 1, -2)) return true;
      }
    }
    else if (curRotation == 3)
    {
      if (rot == 0)
      {
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, -1, -1)) return true;
        if (checkPiece(rot, 0, 2)) return true;
        if (checkPiece(rot, -1, 2)) return true;
      }
      else if (rot == 2)
      {
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, -1, -1)) return true;
        if (checkPiece(rot, 0, 2)) return true;
        if (checkPiece(rot, -1, 2)) return true;
      }
    }
  }

  if (curPiece == PC_I)
  {
    if (curRotation == 0)
    {
      if (rot == 1)
      {
        if (checkPiece(rot, -2, 0)) return true;
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, -2, -1)) return true;
        if (checkPiece(rot, 1, 2)) return true;
      }
      else if (rot == 3)
      {
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, 2, 0)) return true;
        if (checkPiece(rot, -1, 2)) return true;
        if (checkPiece(rot, 2, -1)) return true;
      }
    }
    else if (curRotation == 1)
    {
      if (rot == 0)
      {
        if (checkPiece(rot, 2, 0)) return true;
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, 2, 1)) return true;
        if (checkPiece(rot, -1, -2)) return true;
      }
      else if (rot == 2)
      {
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, 2, 0)) return true;
        if (checkPiece(rot, -1, 2)) return true;
        if (checkPiece(rot, 2, -1)) return true;
      }
    }
    else if (curRotation == 2)
    {
      if (rot == 1)
      {
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, -2, 0)) return true;
        if (checkPiece(rot, 1, -2)) return true;
        if (checkPiece(rot, -2, 1)) return true;
      }
      else if (rot == 3)
      {
        if (checkPiece(rot, 2, 0)) return true;
        if (checkPiece(rot, -1, 0)) return true;
        if (checkPiece(rot, 2, 1)) return true;
        if (checkPiece(rot, -1, -2)) return true;
      }
    }
    else if (curRotation == 3)
    {
      if (rot == 0)
      {
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, -2, 0)) return true;
        if (checkPiece(rot, 1, -2)) return true;
        if (checkPiece(rot, -2, 1)) return true;
      }
      else if (rot == 2)
      {
        if (checkPiece(rot, -2, 0)) return true;
        if (checkPiece(rot, 1, 0)) return true;
        if (checkPiece(rot, -2, -1)) return true;
        if (checkPiece(rot, 1, 2)) return true;
      }
    }
  }

  return false;
}


function movePieceDown() {
  return checkPiece(curRotation, 0, -1);
}

function movePieceLeft() {
  return checkPiece(curRotation, -1, 0);
}

function movePieceRight() {
  return checkPiece(curRotation, 1, 0);
}

function rotatePieceLeft() {
  let rot = curRotation - 1;
  if (rot < 0) rot = 3;
  return setPieceRotation(rot);
}

function rotatePieceRight() {
  let rot = curRotation + 1;
  if (rot > 3) rot = 0;
  return setPieceRotation(rot);
}
