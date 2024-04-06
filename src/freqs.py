import serial
import time
import numpy as np

# Open serial port
ser = serial.Serial('/dev/ttyUSB0', 9600)  # Change port as per your system

# Define array of frequencies (example)
class Song:
    def __init__(self, ):
        m_freq_arr = None
        


frequencies = [440, 494, 523, 587, 659, 698, 784, 880]

# Send frequencies to Nucleo board
for frequency in frequencies:
    ser.write(str(frequency).encode())
    time.sleep(0.5)  # Adjust as needed
