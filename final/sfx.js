

// Final reverb pass.
let reverb = new Tone.Reverb(1.0);
reverb.toDestination();

let bgVolume = new Tone.Volume(-4);
bgVolume.connect(reverb);

let lowpass = new Tone.Filter(400, "lowpass");
lowpass.connect(bgVolume);

let bgSynth = new Tone.Synth({
    oscillator: {
        type: "sawtooth"
    }
});
bgSynth.connect(lowpass);

let baseSynth = new Tone.AMSynth({
    oscillator: {
        type: "triangle"
    }
});
baseSynth.connect(lowpass);


let moveSynth = new Tone.Synth({
    oscillator: {
        type: "sine"
    }
});
moveSynth.connect(reverb);

let dropSynth = new Tone.PolySynth(Tone.Synth);
dropSynth.connect(reverb);

let clearOsc = new Tone.Oscillator(440, "triangle");
let clearEnv = new Tone.FrequencyEnvelope({
	attack: 0.2,
    decay: 0.1,
	baseFrequency: "A1",
	octaves: 2.3
});
clearEnv.connect(clearOsc.frequency);

clearOsc.connect(lowpass);
// clearOsc.toDestination();

// Offset a frequency by a fixed number of semitones.
function offsetFreq(freq, semitones) {
    return freq * pow(2, semitones / 12);
}

function offsetNote(note, dist) {
    let freq = Tone.Frequency(note);
    return offsetFreq(freq, dist);   
}
function sfxMove() {

    let targetNote;
    switch (curPiece) {
    case PC_I:
        targetNote = offsetNote(baseNote, 12);
        break;
    case PC_J:
        targetNote = offsetNote(baseNote, 12);
        break;
    case PC_L:
        targetNote = offsetNote(baseNote, 12);
        break;
    case PC_O:
        targetNote = offsetNote(baseNote, 12);
        break;
    case PC_S:
        targetNote = offsetNote(baseNote, 12);
        break;
    case PC_T:
        targetNote = offsetNote(baseNote, 12);
        break;
    default:
    case PC_Z:
        targetNote = offsetNote(baseNote, 12);
        break;
    }
    moveSynth.triggerAttackRelease(targetNote, 0.3);
}

let baseNote;

let bgSeq;
let baseSeq;
function startBgMusic() {
    if (bgSeq) bgSeq.stop();
    if (baseSeq) baseSeq.stop();
    
    let rate = '0.25n';
    baseNote = 'E2';

    let basePart = [
        'E2',
        'A2',
        'E2',
        'A2',
        'D3',
        'C3',
        'E3',
        'A2'
    ];

    // Set up the background sequence.
    let part1 = [
        'E4', [],
        'B3',
        'C4',
        'D4', [],
        'C4',
        'B3',
        'A3', [],
        'A3',
        'C4',
        'E4', [],
        'D4',
        'C4',
        'B3', [], [],
        'C4',
        'D4', [],
        'E4', [],
        'C4', [],
        'A3', [],
        'A3', [],
        [], []
    ];

    let part2 = [
        [],
        'D4', [],
        'F4',
        'A4', [],
        'G4',
        'F4',
        'E4', [], [],
        'C4',
        'E4', [],
        'D4',
        'C4',
        'B3', [],
        'B3',
        'C4',
        'D4', [],
        'E4', [],
        'C4', [],
        'A3', [],
        'A3', [],
        [], []
    ];

    bgSeq = new Tone.Sequence(function(time, note){
        if (note == 'P1')
            baseNote = 'E2';
        else if (note == 'P2')
            baseNote = 'A2';
        else
            bgSynth.triggerAttackRelease(note, 0.2);
    }, part1.concat(part2), rate);

    baseSeq = new Tone.Sequence(function(time, note) {
        baseNote = note;
        baseSynth.triggerAttackRelease(note, 1);
    }, basePart, '1n');

    bgSeq.start();
    baseSeq.start();

    Tone.Transport.start();
    Tone.Transport.bpm.value = 120;
}

function stopBgMusic() {
    if (bgSeq) {
        bgSeq.stop();
        bgSeq = null;
    }

    if (baseSeq) {
        baseSeq.stop();
        baseSeq = null;
    }
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

let playingClear = false;
async function playClear() {
    if (playingClear)
    return;

    playingClear = true;
    clearOsc.start();
    clearEnv.triggerAttackRelease(0.1);
    await delay(500);
    clearOsc.stop();
    playingClear = false;
}

function sfxDrop() {
    dropSynth.triggerAttackRelease(baseNote, 0.1);
}

function sfxLineClear() {
    // dropSynth.triggerAttackRelease(offsetNote(baseNote, 12), 0.1);
    playClear();
}