

// Final reverb pass.
let reverb = new Tone.Reverb(1.0);
reverb.toDestination();

let moveSynth = new Tone.Synth({
    oscillator: {
        type: "sine"
    }
});
moveSynth.connect(reverb);

let dropSynth = new Tone.PolySynth(Tone.Synth);
dropSynth.connect(reverb);

function sfxMove() {
    let targetNote;
    switch (curPiece) {
    case PC_I:
        targetNote = 'C3';
        break;
    case PC_J:
        targetNote = 'E3';
        break;
    case PC_L:
        targetNote = 'G3';
        break;
    case PC_O:
        targetNote = 'B3';
        break;
    case PC_S:
        targetNote = 'D4';
        break;
    case PC_T:
        targetNote = 'F3';
        break;
    default:
    case PC_Z:
        targetNote = 'D3';
        break;
    }
    moveSynth.triggerAttackRelease(targetNote, 0.3);
}

function sfxDrop() {
    dropSynth.triggerAttackRelease('G2', 0.1);
}

function sfxLineClear() {
    dropSynth.triggerAttackRelease('G4', 0.1);
}