
import { Melody } from "./melody";

type NoteInstruction = {
    frequency: number,
    startTimeMs: number,
    durationMs: number,
};

type MelodyFormat = NoteInstruction[];

function melodySerialize(melody: Melody, shortestNoteDurationMs: number, note0Frequency: number): MelodyFormat {
    const result: MelodyFormat = [];
    for (let i = 0; i < melody.length; i++) {
        for (const note of melody[i]) {
            if (i > 0 && melody[i - 1].has(note)) {
                continue; // note already playing
            }

            let durationNotes = 1;
            for (let j = i + 1; j < melody.length; j++) {
                if (!melody[j].has(note)) {
                    break;
                }
                durationNotes += 1;
            }

            const frequency = Math.pow(note0Frequency, note * Math.pow(2, 1 / 12));
            result.push({
                startTimeMs: i * shortestNoteDurationMs,
                durationMs: durationNotes * shortestNoteDurationMs,
                frequency: frequency,
            });
        }
    }

    return result;
}
