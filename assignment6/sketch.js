
let synth = new Tone.PolySynth(Tone.Synth);
let vibrato = new Tone.Vibrato(4, 0.1);

synth.connect(vibrato);
vibrato.toDestination();

let vibratoSlider;

let notes = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5',
  'l': 'D5',
};

function setup() {
  createCanvas(400, 400);

  vibratoSlider = createSlider(0, 1, 0.1, 0.01);
  vibratoSlider.position(150, 200);
  // chorus.depth.value = 20;
  vibratoSlider.mouseMoved(() => vibrato.depth.value = vibratoSlider.value());
}

function keyPressed() {
  let note = notes[key];
  synth.triggerAttack(note);
}

function keyReleased() {
  let note = notes[key];
  synth.triggerRelease(note, '+0.03');
}

function draw() {
  background('cyan');

  text("Press A-L to play notes!", 120, 180);
  text("Vibrato", 100, 214);
}
