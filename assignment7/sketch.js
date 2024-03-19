
var guy = null;

function preload() {
  guy = loadImage('assets/guy.png');  
}
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  if (mouseIsPressed) {
    background(guy);
  }
  else {
    background(220);
    text("Press mouse for sound!", 130, 200);
  }
}

// Signal A - Sweeping gulp sound
let filter = new Tone.Filter(400, "highpass");

let oscillator = new Tone.Oscillator(440, "triangle");
let freqEnv = new Tone.FrequencyEnvelope({
	attack: 0.2,
  decay: 0.4,
	baseFrequency: "A1",
	octaves: 2.3
});
freqEnv.connect(oscillator.frequency);
freqEnv.triggerAttack();

let sweep = new Tone.Loop((time) => {
  freqEnv.triggerRelease();
  freqEnv.triggerAttack();
}, "8n");

oscillator.connect(filter);

// Signal B - Water trickling
let noise = new Tone.Noise("brown");
let scale = new Tone.Scale(0.5, 1.0);
noise.connect(scale);

// Multiply the two signals together.
let mult = new Tone.Multiply();
filter.connect(mult);
scale.connect(mult.factor);

// Give it some reverb.
let reverb = new Tone.Reverb(0.1);
mult.connect(reverb);
reverb.toDestination();

noise.start();

// let sfx = new Tone
function mousePressed() {
  oscillator.start();

  freqEnv.triggerAttack();
  sweep.start(0);
  Tone.Transport.start();
  // freqEnv.triggerAttack();
}

function mouseReleased() {
  // freqEnv.triggerRelease();
  sweep.stop();
  oscillator.stop();
  Tone.Transport.stop();
}