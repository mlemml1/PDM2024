
const colorWidth = 24;
const colorHeight = 24;
var selectedColor = 0;
var drawing = false;
var lastX = 0;
var lastY = 0;
const colors = [
  'red',
  'orange',
  'yellow',
  'lime',
  'cyan',
  'blue',
  'magenta',
  'brown',
  'white',
  'black'
];

function setup() {
  createCanvas(600, 400);
  background(220);
}

function draw() {

  // Draw the line.
  if (drawing) {
    strokeWeight(10);
    stroke(colors[selectedColor]);
    line(lastX, lastY, mouseX, mouseY);
    lastX = mouseX;
    lastY = mouseY;
  }

  for (let iColor = 0; iColor < colors.length; iColor++)
  {
    strokeWeight(0);
    fill(colors[iColor]);
    const margin = 1;
    rect(margin, iColor * colorHeight + margin, colorWidth - margin * 2, colorHeight - margin * 2);
  }
}

function mousePressed() {
  if (mouseX < colorWidth) {
    let colorIdx = Math.floor(mouseY / colorHeight);
    if (colorIdx < colors.length) {
      selectedColor = colorIdx;
      return;
    }
  }

  // Fallback. Begin drawing.
  drawing = true;
  lastX = mouseX;
  lastY = mouseY;
}

function mouseReleased() {
  drawing = false;
}
