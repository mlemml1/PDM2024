
let running = false;

let fallSpeed = 0;
let fallTime = 0;

let score = 0;
let level = 0;
let nextLevelScore = 0;

let rotateLeft = false,
  rotateRight = false,
  moveLeft = false,
  moveRight = false,
  drop = false,
  hold = false
  canHold = false;

let curPiece = -1;
let heldPiece = -1;
let queuedPieces = Array.from({length: NUM_QUEUED}, (val, index) => 0);
let curX = 0, curY = 0;
let curRotation = 0;
let timeSinceLastMove = 0;
let soundTime = 0;
let isPieceAboutToPlace = false;

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function dropPiece() {
  // Prevent infinite loop.
  let nDrop = NUM_ROWS;
  while (nDrop--)
  {
    if (!checkPiece(curRotation, 0, -1))
      break;
  }
}

function holdPiece() {
  let tmp = curPiece;
  curPiece = heldPiece;
  heldPiece = tmp;

  if (curPiece == -1)
  {
    chooseNewPiece();
  }
  else
  {
    timeSinceLastMove = 0;
    fallTime = 0;
    curRotation = 0;

    let block = getPiece(curPiece, 0);
    curX = floor(NUM_COLS / 2) - floor(block.width / 2);
    curY = -1;

    if (!canFitPieceAt(curX, curY, curPiece, curRotation))
    {
      gameOver();
    }
  }
}

// Game stuff.
function resetKeyState()
{
  rotateLeft = false;
  rotateRight = false;
  moveLeft = false;
  moveRight = false;
  moveDown = false;
  drop = false;
  hold = false;
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    rotateRight = true;
  }
  else if (keyCode == LEFT_ARROW) {
    moveLeft = true;
  }
  else if (keyCode == RIGHT_ARROW) {
    moveRight = true;
  }
  else if (keyCode == DOWN_ARROW) {
    moveDown = true;
  }
  else if (keyCode == 32) {
    drop = true;
  }
  else if (key == 'c') {
    hold = true;
  }
}

function gameLoop() {
  if (!running)
    return;

  // Time between frames in seconds.
  let dt = deltaTime / 1000.0;
  soundThink(dt);
  gameThink(dt);
  resetKeyState();
}

function gameOver() {
  console.log("Game over!");
  running = false;
}

function soundThink(dt) {
}

function gameThink(dt) {
  if (score >= nextLevelScore)
  {
    // Next level.
    incrementLevel();
  }

  // At the beginning of the frame, always detach the piece from the board.
  detachPiece();

  isPieceAboutToPlace = false;

  timeSinceLastMove += dt;
  // Process input.
  if (rotateLeft)
  {
    if (rotatePieceLeft())
      timeSinceLastMove = 0;
  }
  else if (rotateRight)
  {
    if (rotatePieceRight())
      timeSinceLastMove = 0;
  }
  else if (moveLeft)
  {
    if (movePieceLeft())
      timeSinceLastMove = 0;
  }
  else if (moveRight)
  {
    if (movePieceRight())
      timeSinceLastMove = 0;
  }
  else if (moveDown)
  {
    if (movePieceDown())
      timeSinceLastMove = 0;
  }
  else if (drop)
  {
    // Drop it and attach it.
    dropPiece();
    attachPiece();
    chooseNewPiece();

    // If we lost, early out.
    if (!running)
      return;
  }
  else if (hold && canHold)
  {
    holdPiece();
    canHold = false;

    // If we lost, early out.
    if (!running)
      return;
  }

  // Did our piece fall?
  fallTime += dt;
  while (fallTime > fallSpeed)
  {
    fallTime -= fallSpeed;
    if (movePieceDown())
      timeSinceLastMove = 0;
  }

  // Place the block if we can't move down anymore.
  if (!canFitPieceAt(curX, curY + 1, curPiece, curRotation))
  {
    if (timeSinceLastMove > 0.5)
    {
      attachPiece();
      chooseNewPiece();

      // If we lost, early out.
      if (!running)
        return;
    }
    else
    {
      isPieceAboutToPlace = true;
    }
  }

  // Clear any full lines and add up the score!
  scoreThink();

  // Reattach the current piece to the display at the end of the frame.
  attachPiece();
}

function scoreThink() {
  let numCollapsed = 0;

  // Clear any filled rows.
  for (let row = NUM_ROWS - 1; row >= 0;)
  {
    let filled = true;
    for (let col = 0; col < NUM_COLS; col++)
    {
      if (!getCell(col, row))
      {
        filled = false;
        break;
      }
    }

    if (filled)
    {
      collapseRowsAbove(row);
      numCollapsed++;
    }
    else
    {
      --row;
    }
  }

  score += numCollapsed * 100;
}

function chooseNewPiece() {
  timeSinceLastMove = 0;
  fallTime = 0;
  canHold = true;

  // Dequeue a piece.
  let piece = queuedPieces.shift();
  queuedPieces[NUM_QUEUED - 1] = randomInt(7);

  curPiece = piece;
  curRotation = 0;

  let block = getPiece(piece, 0);
  curX = floor(NUM_COLS / 2) - floor(block.width / 2);
  curY = -1;

  if (!canFitPieceAt(curX, curY, curPiece, curRotation))
  {
    gameOver();
  }
}

function incrementLevel() {
  level++;
  nextLevelScore += 2000;

  
  if (fallSpeed > 0.25)
  {
    fallSpeed -= 0.2;
  }
  else
  {
    // Get progressively more impossible after level 5.
    fallSpeed *= 0.5;
  }
}



function startGame() {
  cellGrid = Array.from({length: NUM_ROWS * NUM_COLS}, (val, index) => 0);
  resetKeyState();

  // Reset all parameters
  fallSpeed = 1.0;
  fallTime = 0.0;
  timeSinceLastMove = 0.0;
  soundTime = 1000000.0; // force start music loop
  isPieceAboutToPlace = false;
  curPiece = -1;
  heldPiece = -1;
  curX = 0;
  curY = 0;
  curRotation = 0;
  canHold = true;

  // Queue up some pieces.
  for (let i = 0; i < NUM_QUEUED; i++)
    queuedPieces[i] = randomInt(7);

  score = 0;
  level = 1;
  nextLevelScore = 1500;
  running = true;

  // console.log(`start game`);
  chooseNewPiece();
}

// let font;

function preload() {
  // font = loadFont('assets/inconsolata.otf');
}

function setup() {
  createCanvas(700, 1000);

  startGame();
}

function drawBlock(block, x, y) {
  for (let row = 0; row < block.height; row++) {
    for (let col = 0; col < block.width; col++) {
      let cellColor = block.Get(col, row) ? block.color : 0;

      // Separate out RGB.
      let r = (cellColor >> 16) & 0xFF;
      let g = (cellColor >> 8) & 0xFF;
      let b = (cellColor >> 0) & 0xFF;
      fill(r, g, b);
      stroke(cellColor ? 0 : 40);
      // fill(cellColor ? 'white' : 'black');
      square(x + col * cellSize, y + row * cellSize, cellSize);
    }
  }
}

function draw() {
  // Update game logic each frame.
  gameLoop();

  background(0);
  const margin = 16;

  if (running) {

    // Game details.
    fill('white');
    textSize(30);
    textFont('Poppins');
    
    text(`Score: ${score}`, 300, 90);

    let x_offset = margin;
    let y_offset = 128;

    // Draw hold window.
    let x_center = x_offset + (cellSize * 4) * 0.5;
    if (heldPiece != -1) {
      let piece = getPiece(heldPiece, 0);
      let piece_x = x_center - (piece.width * cellSize) * 0.5;
      drawBlock(piece, piece_x, y_offset);
    }
    x_offset += cellSize * 4 + margin;

    // Draw cell grid.
    for (row = 0; row < NUM_ROWS; row++) {
      for (col = 0; col < NUM_COLS; col++) {
        let cellColor = getCell(col, row);
  
        // Separate out RGB.
        let r = (cellColor >> 16) & 0xFF;
        let g = (cellColor >> 8) & 0xFF;
        let b = (cellColor >> 0) & 0xFF;
        fill(r, g, b);
        stroke(cellColor ? 0 : 40);
        // fill(cellColor ? 'white' : 'black');
        square(x_offset + col * cellSize, y_offset + row * cellSize, cellSize);
      }
    }
    x_offset += NUM_COLS * cellSize;

    // Draw upcoming pieces.
    x_offset += margin;
    x_center = x_offset + (cellSize * 4) * 0.5;
    for (let i = 0; i < NUM_QUEUED; i++) {
      let piece = getPiece(queuedPieces[i], 0);
      let piece_x = x_center - (piece.width * cellSize) * 0.5;
      drawBlock(piece, piece_x, y_offset);
      y_offset += piece.height * cellSize + 16;
    }
  }

}
