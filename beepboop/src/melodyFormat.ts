
import { MIN_NOTE } from "./constants";
import { Melody } from "./melody";

export type NoteInstruction = {
    frequency: number,
    startTimeMs: number,
    durationMs: number,
};

export type MelodyFormat = NoteInstruction[];

export function melodySerialize(melody: Melody, shortestNoteDurationMs: number, note0Frequency: number): MelodyFormat {
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

            const frequency = note0Frequency * Math.pow(Math.pow(2, 1 / 12), note - MIN_NOTE);
            result.push({
                startTimeMs: i * shortestNoteDurationMs,
                durationMs: durationNotes * shortestNoteDurationMs,
                frequency: frequency,
            });
        }
    }

    return result;
}
