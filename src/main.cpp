#include <Arduino.h>

#define buzzerPin 3
#define controlButtonPin A2
#define A4 440

enum State {
  IDLE,
  PLAYING
};

enum ButtonState {
  PRESSED,
  RELEASED
};

void play(int, int);
bool isPressed(int);

State currentState = IDLE;
State lastState;
ButtonState buttonState = RELEASED;
ButtonState lastButtonState;

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(controlButtonPin, INPUT);
}

void loop() {
  lastState = currentState;
  lastButtonState = buttonState;
  delay(100);
  buttonState = isPressed(controlButtonPin) ? PRESSED : RELEASED;
  if (buttonState == RELEASED && lastButtonState == PRESSED) {
    currentState = currentState == IDLE ? PLAYING : IDLE;
  }
  if(currentState != lastState) {
    if(currentState == PLAYING) {
      tone(buzzerPin, A4);
    }
    else{
      noTone(buzzerPin);
    }
  }
}

bool isPressed(int buttonPin) {
  return digitalRead(buttonPin) == LOW;
}