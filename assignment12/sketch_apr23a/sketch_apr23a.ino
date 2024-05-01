
#define VRX_PIN A0
#define VRY_PIN A1
#define SW_PIN 2
#define LED_R_PIN 9
#define LED_G_PIN 10
#define LED_B_PIN 11
#define CHANGE_COLOR_PIN 4
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
  pinMode(LED_R_PIN, OUTPUT);
  pinMode(LED_G_PIN, OUTPUT);
  pinMode(LED_B_PIN, OUTPUT);
  pinMode(CHANGE_COLOR_PIN, INPUT);

  // initialize all the readings to 0:
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    xReadings[thisReading] = 0;
    yReadings[thisReading] = 0;
  }
}

void loop() {
  // Read values.
  int sw = digitalRead(SW_PIN);
  int changeColor = digitalRead(CHANGE_COLOR_PIN);

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
      snprintf(buf, bufLen, "%d,%d,%d,%d\n", xAverage - xStart, yAverage - yStart, !sw, changeColor);

      Serial.print(buf);
    }
  }


  while (Serial.available() > 0) {
    int ledR = Serial.parseInt();
    int ledG = Serial.parseInt();
    int ledB = Serial.parseInt();
    if (Serial.read() == '\n') {
      analogWrite(LED_R_PIN, constrain(ledR, 0, 255));
      analogWrite(LED_G_PIN, constrain(ledG, 0, 255));
      analogWrite(LED_B_PIN, constrain(ledB, 0, 255));

      // Serial.println(ledState, HEX);
    }
  }

}
