#include <Arduino.h>
#include <pitches.h>


#define buzzerPin 3
#define TIMEOUT 60
#define NOTE_DURATION 3000
#define NOTE_PAUSE NOTE_DURATION * 1.30
#define RATE 8096
#define leftButton A1
#define middleButton A2
#define rightButton A3
#define debounceDelay 30

struct Key
{
    int pin;
    int frequency;
    bool pressed;
    Key(int p, int f)
    {
        pin = p;
        frequency = f;
        pressed = false;
    }
};


struct Tone
{
    int frequency;
    uint32_t startTime;
    uint32_t duration;
    bool wasPlaying;
    Tone *next;
    Tone(int f, uint32_t s, int d)
    {
        frequency = f;
        startTime = s;
        duration = d;
        next = NULL;
        wasPlaying = false;
    }
    bool isPlaying()
    {
        uint32_t currentTime = millis();
        return startTime < currentTime && currentTime < duration + startTime;
    }
    bool hasEnded()
    {
        return millis() > startTime + duration;
    }
};

struct Queue 
{
    unsigned length;
    unsigned playingCount;
    Tone *head;
    Queue()
    {
        length = 0;
        playingCount = 0;
        head = NULL;
    }
    void insert(int frequency, uint32_t startTime, int duration)
    {
        Tone *newTone = new Tone(frequency, startTime, duration);
        if (head == NULL)
        {
            head = newTone;
        }
        else
        {
            newTone->next = head;
            head = newTone;
        }
        length++;
        if(newTone->isPlaying())
        {
            playingCount++;
        }
    }
    void walk()
    {
        Tone *current = head;
        Tone *prev = NULL;
        while (current != NULL)
        {
            if (current->hasEnded())
            {
                if (prev == NULL)
                {
                    head = current->next;
                }
                else
                {
                    prev->next = current->next;
                }
                current = current->next;
                delete current;
                playingCount = playingCount <= 0 ? 0 : playingCount - 1;
                length = length <= 0 ? 0 : length - 1;
            }
            else
            {
                if (current->isPlaying())
                {
                    if (!current->wasPlaying)
                    {
                        current->wasPlaying = true;
                        playingCount++;
                    }
                    tone(buzzerPin, current->frequency, RATE/(1000*playingCount));
                }
                current = current->next;
                prev = current;
                delayMicroseconds(RATE/playingCount);
            }
        }
        noTone(buzzerPin);
    }
    ~Queue()
    {
        Tone *current = head;
        Tone *next = NULL;
        while (current != NULL)
        {
            next = current->next;
            delete current;
            current = next;
        }
    }

};

void playTone(int, int, float);
void playScale();
void scaleLoop();
void handleKey(Key);

Queue tones;
int chord[] = {NOTE_C5, NOTE_E5, NOTE_G5}; // C major triad

Key left(leftButton, NOTE_C5);
Key middle(middleButton, NOTE_E5);
Key right(rightButton, NOTE_G5);

uint32_t lastDebounceTime = 0;
uint32_t lastReadTime = 0;

void setup()
{
    pinMode(buzzerPin, OUTPUT);
    pinMode(leftButton, INPUT_PULLUP);
    pinMode(middleButton, INPUT_PULLUP);
    pinMode(rightButton, INPUT_PULLUP);

    tones.insert(NOTE_C5, millis(), NOTE_DURATION);
    tones.insert(NOTE_C4, millis() + 5000, NOTE_DURATION);
    Serial.begin(9600);
}


void loop() {
    if (millis() - lastReadTime > TIMEOUT)
    {
        lastReadTime = millis();
        left.pressed = digitalRead(left.pin) == LOW;
        middle.pressed = digitalRead(middle.pin) == LOW;
        right.pressed = digitalRead(right.pin) == LOW;
    }
    handleKey(left);
    handleKey(middle);
    handleKey(right);

    tones.walk();
}

void scaleLoop() {
    playScale();
    noTone(buzzerPin);
    delay(5000);
}

void handleKey(Key key)
{
    if (key.pressed && digitalRead(key.pin) == HIGH
        && (millis() - lastDebounceTime) > debounceDelay)
    {
        lastDebounceTime = millis();
        switch(key.pin)
        {
            case leftButton:
                tones.insert(key.frequency, millis(), NOTE_DURATION);
                break;
            case middleButton:
                tones.insert(key.frequency, millis() + 500, NOTE_DURATION);
                break;
            case rightButton:
                tones.insert(key.frequency, millis() + 5000, NOTE_DURATION);
                break;
        }
    }
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
