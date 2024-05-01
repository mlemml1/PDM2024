
#define VRX_PIN A0
#define VRY_PIN A1
#define SW_PIN 2
#define LED1_PIN 10
#define LED2_PIN 11
int joyX = 0, joyY = 0, sw = 0;

const int numReadings = 10;

int xReadings[numReadings];  // the readings from the analog input
int yReadings[numReadings];  // the readings from the analog input
int readIndex = 0;          // the index of the current reading
int xTotal = 0, yTotal = 0;              // the running total
int xAverage = 0, yAverage = 0;            // the average
int xStart = 0, yStart = 0;
bool start = false;
unsigned long lastTime = 0;
const int interval = 50;

void setup() {
  Serial.begin(9600);
  pinMode(SW_PIN, INPUT_PULLUP);
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);

  // initialize all the readings to 0:
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    xReadings[thisReading] = 0;
    yReadings[thisReading] = 0;
  }
}

void loop() {
  // Read values.
  int sw = digitalRead(SW_PIN);

  // subtract the last reading:
  xTotal = xTotal - xReadings[readIndex];
  yTotal = yTotal - yReadings[readIndex];

  // read from the sensor:
  xReadings[readIndex] = analogRead(VRX_PIN);
  yReadings[readIndex] = analogRead(VRY_PIN);

  // add the reading to the total:
  xTotal = xTotal + xReadings[readIndex];
  yTotal = yTotal + yReadings[readIndex];

  // advance to the next position in the array:
  readIndex = readIndex + 1;

  // calculate the average:
  xAverage = xTotal / numReadings;
  yAverage = yTotal / numReadings;

  // if we're at the end of the array...
  if (readIndex >= numReadings) {
    // ...wrap around to the beginning:
    readIndex = 0;
    if (!start) {
      xStart = xAverage;
      yStart = yAverage;
      start = true;
    }
  }

  if (start) {
    unsigned long now = millis();
    if (now - lastTime > interval) {
      lastTime = now;
      const int bufLen = 100;
      static char buf[bufLen];
      snprintf(buf, bufLen, "%d,%d,%d\n", xAverage - xStart, yAverage - yStart, !sw);

      Serial.print(buf);
    }
  }


  while (Serial.available() > 0) {
    int ledState = Serial.parseInt();
    if (Serial.read() == '\n') {
      analogWrite(LED1_PIN, constrain(ledState, 0, 255));

      Serial.println(ledState, HEX);
    }
  }

}
