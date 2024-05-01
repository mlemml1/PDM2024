
// These constants won't change. They're used to give names to the pins used:
const int playerTurnPin = 2;
const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to

const int light1Pin = 10;
const int light2Pin = 11;

int turnValue = 0;
bool currentTurn = false;

int targetValue;
int sensorValue = 0;  // value read from the pot
bool flashing = false;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);

  targetValue = random(200, 800);
}

void checkTurn() {
  int oldTurn = turnValue;
  turnValue = digitalRead(playerTurnPin);
  if (turnValue != oldTurn && turnValue) {
    // Change turns.
    currentTurn = !currentTurn;
    targetValue = random(200, 800);
  }
}

void loop() {
  sensorValue = analogRead(analogInPin);
  int light1Value = constrain(map(sensorValue, 0, targetValue, 0, 255), 0, 1023);
  int light2Value = constrain(map(sensorValue, 1023, targetValue, 0, 255), 0, 1023);

  // Are we matching? (win)
  if (abs(light1Value - light2Value) < 100) {
    flashing = !flashing;
    light1Value = flashing ? 1023 : 0;
    light2Value = flashing ? 0 : 1023;
    checkTurn();
    delay(200);
  }

  
  int output1Value = map(light1Value, 0, 1023, 0, 255);
  int output2Value = map(light2Value, 0, 1023, 0, 255);

  // change the analog out value:
  analogWrite(light1Pin, output1Value);
  analogWrite(light2Pin, output2Value);

  // print the results to the Serial Monitor:
  Serial.print("sensor = ");
  Serial.print(sensorValue);
  Serial.print("\t output = ");
  Serial.print(light1Value);
  Serial.print(", ");
  Serial.println(light2Value);

  // wait 2 milliseconds before the next loop for the analog-to-digital
  // converter to settle after the last reading:
  delay(2);
}
