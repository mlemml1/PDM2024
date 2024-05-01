
const colorWidth = 24;
const colorHeight = 24;
var selectedColor = 0;
var drawing = false;
var lastX = 0;
var lastY = 0;
var totalDist = 0;
var distSinceClear = 0;
var port;
var cursorHint;

/*
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
*/

const colors = [
  {
    name: 'red',
    rgb: [255, 0, 0],
    freq: Tone.Frequency('A4'),
    quality: 2,
    rate: 1,
  },
  {
    name: 'orange',
    rgb: [255, 165, 0],
    freq: Tone.Frequency('B4'),
    quality: 3,
    rate: 0.9,
  },
  {
    name: 'yellow',
    rgb: [255, 255, 0],
    freq: Tone.Frequency('C5'),
    quality: 0,
    rate: 0.8,
  },
  {
    name: 'lime',
    rgb: [0, 255, 0],
    freq: Tone.Frequency('D5'),
    quality: 1,
    rate: 0.7,
  },
  {
    name: 'cyan',
    rgb: [0, 255, 255],
    freq: Tone.Frequency('E5'),
    quality: 2,
    rate: 0.6,
  },
  {
    name: 'blue',
    rgb: [0, 0, 255],
    freq: Tone.Frequency('F5'),
    quality: 3,
    rate: 0.5,
  },
  {
    name: 'magenta',
    rgb: [255, 0, 255],
    freq: Tone.Frequency('G5'),
    quality: 0,
    rate: 0.4,
  },
  {
    name: 'brown',
    rgb: [128, 0, 0],
    freq: Tone.Frequency('A5'),
    quality: 1,
    rate: 0.3,
  },
  {
    name: 'white',
    rgb: [255, 255, 255],
    freq: Tone.Frequency('B5'),
    quality: 2,
    rate: 0.2,
  },
  {
    name: 'black',
    rgb: [0, 0, 0],
    freq: Tone.Frequency('C4'),
    quality: 3,
    rate: 0.85,
  },
];

// Give it some reverb.
let reverb = new Tone.Reverb(10.0);
reverb.toDestination();

let lowpass = new Tone.Filter(800, "lowpass");
lowpass.connect(reverb);

let chord = [];
for (let i = 0; i < 4; i++) {
  let synth = new Tone.AMSynth({
    oscillator: {
      type: "triangle"
    }
  });

  synth.harmonicity.value = .5;
  // synth.modulationIndex = .1;
  chord[i] = synth;
  // chord[i].toDestination();
  chord[i].connect(lowpass);
}

let bgSynth = new Tone.Synth({
  oscillator: {
    type: "sine"
  }
}); // .toDestination()
bgSynth.connect(reverb);

var bgSeq = null;

var selectNoise = new Tone.Synth({
  oscillator: {
    type: "sawtooth"
  }
});
selectNoise.connect(lowpass);

// Offset a frequency by a fixed number of semitones.
function offsetFreq(freq, semitones) {
  return freq * pow(2, semitones / 12);
}

// Build chord around a base frequency.
// Quality:
// 0: diminished
// 1: minor
// 2: major
// 3: augmented
function buildChord(freq, quality) {
  totalDist = 0;

  // Root.
  chord[0].triggerAttack(freq);

  // Major 3rd.
  let third = quality >= 2 ? 4 : 3;
  chord[1].triggerAttack(offsetFreq(freq, third));
  chord[1].volume.value = -36;

  // Perfect 5th.
  let fifth = 7;
  if (quality == 0) fifth = 6;
  else if (quality == 3) fifth = 8;
  chord[2].triggerAttack(offsetFreq(freq, fifth));
  chord[2].volume.value = -36;

  // Major/minor seventh.
  let seventh = 11;
  if (quality <= 1) seventh = 10;
  chord[3].triggerAttack(offsetFreq(freq, seventh));
  chord[3].volume.value = -36;

}

function rampChord(delta) {
  totalDist -= delta * 0.01;
  distSinceClear += delta;

  let phaseOffset = PI / 2.0;

  // Cycle through notes played based on how far we've drawn.
  let cycle0 = sin(totalDist) * 0.5 + 0.5;
  let cycle1 = sin(totalDist + phaseOffset) * 0.5 + 0.5;
  let cycle2 = sin(totalDist + phaseOffset * 2) * 0.5 + 0.5;

  // Prioritize root and fifth.
  chord[1].volume.value = cycle0 * -36 - 6;
  chord[2].volume.value = cycle1 * -36;
  chord[3].volume.value = cycle2 * -36 - 6;
}

function releaseChord() {
  for (let i = 0; i < 4; i++)
    chord[i].triggerRelease();
}

function createBackgroundMusic(freq, quality, rate) {
  if (bgSeq) bgSeq.stop();

  let fifth = 7;
  if (quality == 0) fifth = 6;
  else if (quality == 3) fifth = 8;

  Tone.Transport.start();
  Tone.Transport.bpm.value = 100;

  let arpeggio = [freq, offsetFreq(freq, fifth), offsetFreq(freq, 12), offsetFreq(freq, fifth)];
  // Set up the background sequence.
  bgSeq = new Tone.Sequence(function(time, note){
    bgSynth.triggerAttackRelease(note, 0.5);
  }, arpeggio, rate);


  bgSeq.start();
}

function setup() {
  createCanvas(600, 400);
  background(220);

  // createBackgroundMusic(offsetFreq(colors[selectedColor].freq, -24), colors[selectedColor].quality, '2n' /*colors[selectedColor].rate*/);

  let refresh = createButton('Clear');
  refresh.position(0, 400);
  refresh.mousePressed(function() {
    background(220);
    selectNoise.triggerAttackRelease(offsetFreq(colors[selectedColor].freq, 7), 0.1);
    distSinceClear = 0;
  });

  port = createSerial();
  let connectButton = createButton("Connect");
  connectButton.position(50, 400);
  connectButton.mousePressed(connect);

  cursorHint = createDiv('*');

  
  selectColor(0);
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  }
  else {
    port.close();
  }
}

function selectColor(color) {
  if (color >= colors.length || color < 0)
    color = 0;
  selectedColor = color;
  selectNoise.triggerAttackRelease(offsetFreq(colors[selectedColor].freq, 12), 0.1);
  createBackgroundMusic(offsetFreq(colors[selectedColor].freq, -24), colors[selectedColor].quality, '2n' /**/);

  // Update LED.
  let rgb = colors[selectedColor].rgb;
  port.write(`${rgb[0]} ${rgb[1]} ${rgb[2]}\n`);
}

let cursorX = 200, cursorY = 200;
let toggleDraw;
let changeColor;
function updateCursor() {
  let str = port.readUntil("\n");
  let values = str.split(",");

  let wasDrawing = drawing;
  if (values.length >= 4) {
    let x = parseFloat(values[0]);
    let y = parseFloat(values[1]);
    let wantsDraw = parseInt(values[2]) != 0;
    let wantsChangeColor = parseInt(values[3]) != 0;

    if (!isNaN(x) && !isNaN(y)) {
      cursorX += x / 20.0;
      cursorY += y / 20.0;
      if (cursorX < 0) cursorX = 0;
      if (cursorX > 600) cursorX = 600;
      if (cursorY < 0) cursorY = 0;
      if (cursorY > 400) cursorY = 400;
      
      cursorHint.position(cursorX, cursorY);
      console.log(`cursor: ${cursorX} ${cursorY}`);
    }

    let hadToggleDraw = toggleDraw;
    toggleDraw = wantsDraw;
    if (!hadToggleDraw && toggleDraw) {
      drawing = !drawing;
    }

    let hadChangeColor = changeColor;
    changeColor = wantsChangeColor;
    if (!hadChangeColor && changeColor) {
      selectColor(selectedColor + 1);
    }
  }

  if (!wasDrawing && drawing) {
    // start drawing.
    lastX = cursorX;
    lastY = cursorY;

    buildChord(colors[selectedColor].freq, colors[selectedColor].quality);
  }
  if (wasDrawing && !drawing) {
    releaseChord();
  }
}

function draw() {
  updateCursor();

  // Draw the line.
  if (drawing) {
    strokeWeight(10);
    stroke(colors[selectedColor].name);
    line(lastX, lastY, cursorX, cursorY);

    let dx = cursorX - lastX;
    let dy = cursorY - lastY;
    let distanceMoved = sqrt(dx * dx + dy * dy);
    rampChord(distanceMoved);
    
    lastX = cursorX;
    lastY = cursorY;
  }

  Tone.Transport.bpm.value = 100 + distSinceClear * 0.01;

  for (let iColor = 0; iColor < colors.length; iColor++)
  {
    strokeWeight(0);
    fill(colors[iColor].name);
    const margin = 1;
    rect(margin, iColor * colorHeight + margin, colorWidth - margin * 2, colorHeight - margin * 2);
  }

  // fill(50, 50, 50, 20);
  // circle(cursorX, cursorY, 10);
}


// function mousePressed() {
//   if (mouseX < colorWidth) {
//     let colorIdx = Math.floor(mouseY / colorHeight);
//     if (colorIdx < colors.length) {
//       selectedColor = colorIdx;

//       selectNoise.triggerAttackRelease(offsetFreq(colors[selectedColor].freq, 12), 0.1);

//       createBackgroundMusic(offsetFreq(colors[selectedColor].freq, -24), colors[selectedColor].quality, '2n' /**/);
//       return;
//     }
//   }

//   // Fallback. Begin drawing.
//   drawing = true;
//   lastX = mouseX;
//   lastY = mouseY;

//   buildChord(colors[selectedColor].freq, colors[selectedColor].quality);
// }

// function mouseReleased() {
//   drawing = false;

//   releaseChord();
// }
