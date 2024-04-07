import serial
import time
import numpy as np
import wave
import soundfile as sf

FREQ = 8000
RATE = 9600

# Define array of frequencies (example)


class Song:
    "Song"

    def __init__(self, arr: np.array):
        self.m_freq_arr = np.array_split(arr, len(arr) // FREQ)

    def run(self):
        "Run"
        ser = serial.Serial('/dev/ttyACM0', 9600)
        if not ser.is_open:
            ser.open()
        for batch in self.m_freq_arr:
            ser.write(bytes(batch))
            break


def ConvertMusicToFreqs(filepath="files/file.vav") -> np.array:
    data, samplerate = sf.read(filepath)
    return data[::int(samplerate / 8000)]


def test(file='files/speech.pcm'):
    "Test"
    with open(file, 'rb') as pcmfile:
        pcm_data = pcmfile.read()

    audio_data = np.frombuffer(pcm_data, dtype=np.uint8)
    audio_data = audio_data.reshape(-1, 1)

    print(f"Audio data: {audio_data.shape}")

    return audio_data


tmp = Song(test())
tmp.run()
