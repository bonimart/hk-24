from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Sample data for available music tracks
available_tracks = {
    1: "Track 1",
    2: "Track 2",
    3: "Track 3"
}

@app.route('/play-music', methods=['POST'])
def play_music():
    music_notes = request.json.get('music_notes')
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
