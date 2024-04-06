#include <Arduino.h>
#include <pitches.h>


#define buzzerPin 3
#define TIMEOUT 1000
#define NOTE_DURATION 500
#define NOTE_PAUSE NOTE_DURATION * 1.30
#define FREQ 8000


void playScale();
void scaleLoop();
void pcmLoop();

void setup()
{
    pinMode(buzzerPin, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    //scaleLoop();
    //pcmLoop();
}

char pcmData[FREQ];

void pcmLoop() {
    if (Serial.available() > 0)
    {
        int length = Serial.readBytes(pcmData, FREQ);
        for (int i = 0; i < length; i++)
        {
            int readByte = pcmData[i];
            analogWrite(buzzerPin, readByte);
            delayMicroseconds(10);
        }
    }
}

void scaleLoop() {
    playScale();
    noTone(buzzerPin);
    delay(5000);
}

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
