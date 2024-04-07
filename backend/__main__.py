from flask import Flask, jsonify, request
from flask_cors import CORS

import serial
import time
import numpy as np
import wave
import soundfile as sf

FREQ = 8000
RATE = 9600
SONG_HEADER = "play song"
DELIM = ","

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

    ser.write(bytes((SONG_HEADER + DELIM).encode("utf-8")))
    ser.write(bytes(len(track)))
    for instr in track:
        print(instr)
        tone, start, duration = instr["frequency"], instr["startTimeMs"], instr["durationMs"]
        ser.write(bytes(int(tone)))
        ser.write(bytes(int(start)))
        ser.write(bytes(int(duration)))
        print("Song not sent")
    print("Song sent")
    ser.close()


@ app.route('/play-music', methods=['POST'])
def play_music():
    music_notes = request.json.get('music_notes')
    SendSong(music_notes)
    return jsonify({"message": "Not implemented yet"}), 501


@ app.route('/available-tracks', methods=['GET'])
def get_available_tracks():
    return jsonify(available_tracks), 200


@ app.route('/play-selected-track/<int:track_id>', methods=['GET'])
def play_selected_track(track_id):
    if track_id in available_tracks:
        return jsonify({"message": f"Playing track {track_id}: {available_tracks[track_id]}"})
    else:
        return jsonify({"error": "Track not found."}), 404


if __name__ == '__main__':
    # app.run(debug=True)
    inp = {"music_notes": [{"startTimeMs": 500, "durationMs": 4000, "frequency": 622.253967444162}, {"startTimeMs": 8500, "durationMs": 5000, "frequency": 440}, {
        "startTimeMs": 10000, "durationMs": 2500, "frequency": 349.2282314330038}, {"startTimeMs": 15500, "durationMs": 2500, "frequency": 587.3295358348153}]}
    SendSong(inp["music_notes"])
