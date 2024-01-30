// Michael Lemmler, mlemml1

function setup() {
  createCanvas(300, 850);
}

function draw() {
  background(220);

  // example 1
  // lime background
  fill('lime');
  strokeWeight(0);
  rect(50, 50, 200, 100);

  // circle and square
  fill('white');
  stroke('black');
  strokeWeight(1);
  circle(100, 100, 80);
  square(160, 60, 80);

  // example 2
  // white background
  fill('white');
  strokeWeight(0);
  rect(50, 200, 200, 200);

  // red circle
  fill(255, 0, 0, 100);
  circle(150, 270, 100);

  // green circle
  fill(0, 255, 0, 100);
  circle(180, 325, 100);

  // blue circle
  fill(0, 0, 255, 100);
  circle(120, 325, 100);


  // example 3
  // black background
  fill('black');
  rect(50, 450, 200, 100);

  // pacman
  fill('yellow');
  arc(100, 500, 80, 80, -PI + QUARTER_PI, PI - QUARTER_PI, PIE);

  // red ghost
  fill('red');
  rect(160, 460, 80, 80, 40, 40, 0, 0);

  // eyeballs
  fill('white');
  circle(180, 500, 25);
  circle(220, 500, 25);

  // pupils
  fill('blue');
  circle(180, 500, 15);
  circle(220, 500, 15);

  // example 4
  // blue background
  fill('navy');
  rect(50, 600, 200, 200);

  // background circle
  fill('green');
  stroke('white');
  strokeWeight(3);
  circle(150, 700, 100);

  // star
  fill('red');
  beginShape();
  vertex(150, 650);
  vertex(162, 685);
  vertex(200, 685);
  vertex(170, 705);
  vertex(180, 740);
  vertex(150, 720);
  vertex(120, 740);
  vertex(130, 705);
  vertex(100, 685);
  vertex(138, 685);
  endShape('close');
}
