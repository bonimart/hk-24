
import { MelodyFormat } from "./melodyFormat";

export function inBrowserPlay(melody: MelodyFormat) {
    const audioContext = new window.AudioContext();

    for (const notePlay of melody) {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = notePlay.frequency;
        oscillator.connect(audioContext.destination);
        oscillator.start(notePlay.startTimeMs / 1000);
        oscillator.stop((notePlay.startTimeMs + notePlay.durationMs) / 1000);
    }

    return audioContext;
}
