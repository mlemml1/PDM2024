let soundFX;
let rvbAmt;
let rvbSlider;
let font;

function preload() {
  soundFX = new Tone.Players({
    pipe : "assets/pipe.mp3",
    jerma : "assets/jerma.mp3",
    water : "assets/water.mp3",
    meow : "assets/meow.mp3"
  });

  rvbAmt = new Tone.JCReverb(0.4);
  soundFX.connect(rvbAmt);
  rvbAmt.toDestination();

  // font = loadFont('assets/MaterialIconsOutlined-Regular.otf');
}

let buttonSize = 128;
let buttonMargin = 32;

let buttons = [
  {snd: 'pipe', x: buttonMargin, y:buttonMargin, text: 'Metal Pipe'},
  {snd: 'jerma', x: buttonSize + buttonMargin * 2, y:buttonMargin, text: 'Internet Humor'},
  {snd: 'water', x: buttonMargin, y:buttonSize+buttonMargin * 2, text: 'Water Drop'},
  {snd: 'meow', x: buttonSize + buttonMargin * 2, y:buttonSize + buttonMargin * 2, text: 'Cat'}
];

function setup() {
  createCanvas(375, 400);

  rvbSlider = createSlider(0, 1, 0, 0.05);
  rvbSlider.position(buttonSize / 2 + buttonMargin * 1.5, buttonSize * 2 + buttonMargin * 3);
  rvbSlider.mouseMoved(() => rvbAmt.roomSize.value = rvbSlider.value());
}

function keyPressed() {
  if (key === 'q')
    soundFX.player('test').start();
}

function draw() {
  background(220);

  for (let i = 0; i < buttons.length; i++) {
    let left = buttons[i].x;
    let right = buttons[i].x + buttonSize;
    let top = buttons[i].y;
    let bottom = buttons[i].y + buttonSize;
    stroke('black');
    strokeWeight(2);
    if (mouseIsPressed && mouseX >= left && mouseX < right && mouseY >= top && mouseY < bottom) {
      fill('green');
    }
    else {
      fill('white');
    }
    rect(buttons[i].x, buttons[i].y, buttonSize, buttonSize);

    strokeWeight(2);
    stroke('blue');
    fill('white');
    // textFont(font);
    textAlign(CENTER, CENTER);
    textSize(28);
    text(buttons[i].text, left, top, buttonSize, buttonSize);
  }

  strokeWeight(0);
  fill('black');
  textSize(18);
  text("Reverb", 70, 363);

  text('Press the buttons to play sound effects!', 180, 16);
}

function mousePressed() {
  for (let i = 0; i < buttons.length; i++) {
    let left = buttons[i].x;
    let right = buttons[i].x + buttonSize;
    let top = buttons[i].y;
    let bottom = buttons[i].y + buttonSize;
    if (mouseX >= left && mouseX < right && mouseY >= top && mouseY < bottom) {
      // play the sound.
      soundFX.player(buttons[i].snd).start();
    }
  }
}
