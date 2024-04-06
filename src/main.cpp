#include <Arduino.h>
#include <pitches.h>

#define buzzerPin 3
#define controlButtonPin A2
#define TIMEOUT 1000
#define NOTE_DURATION 500
#define NOTE_PAUSE NOTE_DURATION * 1.30

void playScale();

int readByte;

void setup()
{
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);
  pinMode(controlButtonPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // playScale();
  noTone(buzzerPin);
  delay(10*TIMEOUT);
}

// void loop()
// {
//   if (Serial.available() > 0)
//   {
//     readByte = Serial.read();
//     int pwmValue = map(readByte, -127, 127, 0, 255);
//     analogWrite(buzzerPin, pwmValue);
//     delay(1000);
//   }
// }

  // void loop() {
  //   // PCM data generation (replace with your PCM data)
  //   int pcmData[] = {127, 255, 127, 0, -127}; // Example PCM data
  //
  //   // Output PCM data through PWM
  //   for (int i = 0; i < sizeof(pcmData) / sizeof(pcmData[0]); i++) {
  //     int pwmValue = map(pcmData[i], -127, 127, 0, 255);  // Map PCM data to PWM range (0-255)
  //     analogWrite(buzzerPin, pwmValue);  // Output PWM signal
  //     delay(1000);  // Adjust delay based on desired audio playback speed
  //   }
  // }

void playScale()
{
  int scale[] = {NOTE_C5, NOTE_D5, NOTE_E5, NOTE_F5, NOTE_G5, NOTE_A5, NOTE_B5, NOTE_C6};
  int scaleSize = sizeof(scale) / sizeof(scale[0]);
  for (int i = 0; i < scaleSize; i++)
  {
    Serial.println(scale[i]);
    tone(buzzerPin, scale[i], NOTE_DURATION);
    delay(NOTE_PAUSE);
  }
  for (int i = scaleSize - 1; i >= 0; i--)
  {
    tone(buzzerPin, scale[i], NOTE_DURATION);
    delay(NOTE_PAUSE);
  }
}

bool isPressed(int buttonPin)
{
  return digitalRead(buttonPin) == LOW;
}
