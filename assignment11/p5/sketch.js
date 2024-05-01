let port;
let joyX = 0, joyY = 0, sw = 0;
let toggleLed = false;
let connectButton;

function setup() {
  port = createSerial();

  createCanvas(400, 400);

  connectButton = createButton("connect");
  connectButton.mousePressed(connect);
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  }
  else {
    port.close();
  }
}

function draw() {
  let str = port.readUntil("\n");
  let values = str.split(",");

  if (values.length >= 3) {
    joyX = parseFloat(values[0]);
    joyY = parseFloat(values[1]);
    sw = parseInt(values[2]);
  }

  background(joyX / 10.0 + 100, joyY / 10.0 + 100, 100);

  text(str, 10, 10);
  
}

function mousePressed() {
  toggleLed = !toggleLed;
  port.write(`${toggleLed * 100}\n`);
}
