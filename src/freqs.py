import serial
import time
import numpy as np
import wave

FREQ = 8000
RATE = 9600

# Define array of frequencies (example)
class Song:
    "Song"
    def __init__(self, arr: np.array):
        self.m_freq_arr = np.arange(0, np.ceil(len(arr)), dtype=np.ndarray)
        for i, el in enumerate(arr):
            if i % FREQ == 0:
                np.append(self.m_freq_arr, np.array([])) # next batch
            np.append(self.m_freq_arr[-1], el) # add freq to batch
    
    def run(self):
        "Run"
        ser = serial.Serial('/dev/ttyUSB0', 9600)
        if not ser.is_open:
            ser.open()
        for batch in self.m_freq_arr:
            ser.write(bytes(batch))
            time.sleep(1)

def test(file='files/speech.pcm'):
    "Test"
    with open(file, 'rb') as pcmfile:
        pcm_data = pcmfile.read()

    audio_data = np.frombuffer(pcm_data, dtype=np.int16)
    audio_data = audio_data.reshape(-1, 1)
    
    print(audio_data)
    return audio_data

tmp = Song(test())
tmp.run()