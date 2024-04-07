from flask import Flask, jsonify, request
from flask_cors import CORS

import serial
import time
import numpy as np
import wave
import soundfile as sf

FREQ = 8000
RATE = 9600

app = Flask(__name__)
CORS(app) 

# Sample data for available music tracks
available_tracks = {
    1: "Track 1",
    2: "Track 2",
    3: "Track 3"
}

def SendSong(track):
    "Run"
    ser = serial.Serial('/dev/ttyACM0', 9600)
    if not ser.is_open:
        ser.open()
    
    ser.write(bytes("play song"))
    ser.write(bytes(int(len(track))))
    for instr in track:
        tone, start, duration = instr["frequency"], instr["startTimeMs"], instr["duration"]
        ser.write(bytes(int(tone)))
        ser.write(bytes(int(start)))
        ser.write(bytes(int(duration)))

@app.route('/play-music', methods=['POST'])
def play_music():
    music_notes = request.json.get('music_notes')
    SendSong(music_notes)
    return jsonify({"message": "Not implemented yet"}), 501


@app.route('/available-tracks', methods=['GET'])
def get_available_tracks():
    return jsonify(available_tracks), 200


@app.route('/play-selected-track/<int:track_id>', methods=['GET'])
def play_selected_track(track_id):
    if track_id in available_tracks:
        return jsonify({"message": f"Playing track {track_id}: {available_tracks[track_id]}"})
    else:
        return jsonify({"error": "Track not found."}), 404



if __name__ == '__main__':
    app.run(debug=True)


