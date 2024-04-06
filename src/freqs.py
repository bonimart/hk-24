import serial
import time
import numpy as np

FREQ = 8000
RATE = 9600

# Define array of frequencies (example)
class Song:
    "Song"
    def __init__(self, arr: np.array):
        self.m_freq_arr = np.arange(0, np.ceil(len(arr)), dtype=np.array)
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

