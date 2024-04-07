#include <Arduino.h>
#include <pitches.h>


#define buzzerPin 3
#define TIMEOUT 60
#define NOTE_DURATION 1000
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
    uint32_t startPlayingTime;
    Tone *head;
    Queue()
    {
        length = 0;
        playingCount = 0;
        startPlayingTime = millis();
        head = NULL;
    }
    void insert(int frequency, uint32_t startTime, int duration)
    {
        Tone *newTone = new Tone(frequency, startPlayingTime + startTime, duration);
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
void parseSerialInput();
void parseSong();
void playSimpsons();
void userInputLoop();

Queue tones;
int chord[] = {NOTE_C5, NOTE_E5, NOTE_G5}; // C major triad

Key left(leftButton, NOTE_C5);
Key middle(middleButton, NOTE_E5);
Key right(rightButton, NOTE_G5);

uint32_t lastDebounceTime = 0;
uint32_t lastReadTime = 0;

int melody[] = {
  NOTE_C4, NOTE_E4, NOTE_FS4, REST, NOTE_A4,
  NOTE_G4, NOTE_E4, NOTE_C4, NOTE_A3,
  NOTE_FS3, NOTE_FS3, NOTE_FS3, NOTE_G3, REST,
  NOTE_FS3, NOTE_FS3, NOTE_FS3, NOTE_G3, NOTE_AS3,
  NOTE_B3, REST
};

int durations[] = {
  2, 4, 4, 32, 8,
  2, 4, 4, 8,
  8, 8, 8, 4, 2,
  8, 8, 8, 4, 2,
  2, 2
};

void setup()
{
    pinMode(buzzerPin, OUTPUT);
    pinMode(leftButton, INPUT_PULLUP);
    pinMode(middleButton, INPUT_PULLUP);
    pinMode(rightButton, INPUT_PULLUP);
    tones.insert(NOTE_C5, millis(), NOTE_DURATION);
    Serial.begin(9600);
}


void loop() {
    //userInputLoop();
    //scaleLoop();
    playSimpsons();
}

String SONG_HEADER = "play song";
char DELIMITER = ',';

void userInputLoop(){
    if (Serial.available() > 0)
    {
        parseSerialInput();
    }
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

void parseSerialInput()
{
    String input = Serial.readStringUntil(DELIMITER);
    if (input != SONG_HEADER)
    {
        return;
    }
    parseSong();
    tones.startPlayingTime = millis();
}

void playSimpsons(){
  int size = sizeof(durations) / sizeof(int);

  for (int note = 0; note < size; note++) {
    //to calculate the note duration, take one second divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int duration = 1000 / durations[note];
    tone(buzzerPin, melody[note], duration);

    //to distinguish the notes, set a minimum time between them.
    //the note's duration + 30% seems to work well:
    int pauseBetweenNotes = duration * 1.30;
    delay(pauseBetweenNotes);

    //stop the tone playing:
    noTone(buzzerPin);
    }
}

void parseSong()
{
    int length, tone, start, duration;
    length = Serial.parseInt();
    for (int i = 0; i < length; i++)
    {
        start = Serial.parseInt();
        duration = Serial.parseInt();
        tone = Serial.parseInt();
        tones.insert(tone, start, duration);
    }
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
        tones.insert(key.frequency, millis(), NOTE_DURATION);
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
