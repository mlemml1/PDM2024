
const int button1Pin = 2;
const int button2Pin = 3;
const int led1Pin = 12;
const int led2Pin = 13;
int button1State = 0;
int button2State = 0;

void setup() {
  // put your setup code here, to run once:
  pinMode(led1Pin, OUTPUT);
  pinMode(led2Pin, OUTPUT);
  pinMode(button1Pin, INPUT);
  pinMode(button2Pin, INPUT);
}

void loop() {
  button1State = digitalRead(button1Pin);
  button2State = digitalRead(button2Pin);
  // check if the pushbutton is pressed. If it is, the buttonState is HIGH:
  if (button1State == HIGH) {
    // turn LED on:
    if (button2State == HIGH) {
      // Strobe lights!
      digitalWrite(led1Pin, HIGH);
      digitalWrite(led2Pin, HIGH);
      delay(100);

      digitalWrite(led1Pin, LOW);
      digitalWrite(led2Pin, HIGH);
      delay(100);

      digitalWrite(led1Pin, HIGH);
      digitalWrite(led2Pin, LOW);
      delay(100);

      digitalWrite(led1Pin, LOW);
      digitalWrite(led2Pin, LOW);
      delay(100);
    }
    else {
      // Back and forth motion, flicker led 1 twice as fast.
      digitalWrite(led1Pin, LOW);
      digitalWrite(led2Pin, HIGH);
      delay(500);

      digitalWrite(led1Pin, HIGH);
      delay(500);

      digitalWrite(led1Pin, LOW);
      digitalWrite(led2Pin, LOW);
      delay(500);
      
      digitalWrite(led1Pin, HIGH);
      delay(500);
    }
  } else {
    if (button2State == HIGH) {
      // Back and forth motion, flicker led 2 twice as fast.
      digitalWrite(led1Pin, HIGH);
      digitalWrite(led2Pin, LOW);
      delay(500);

      digitalWrite(led2Pin, HIGH);
      delay(500);

      digitalWrite(led1Pin, LOW);
      digitalWrite(led2Pin, LOW);
      delay(500);
      
      digitalWrite(led2Pin, HIGH);
      delay(500);
    }
    else {
      // Back and forth motion.
      digitalWrite(led1Pin, HIGH);
      digitalWrite(led2Pin, LOW);
      delay(1000);
      digitalWrite(led1Pin, LOW);
      digitalWrite(led2Pin, HIGH);
      delay(1000);
    }
  }
}
