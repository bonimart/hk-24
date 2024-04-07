"use client";

import { MelodyDisplay } from "@/components/MelodyDisplay";
import { MELODY_SIZE, SHORTEST_NOTE_DURATION_MS } from "@/constants";
import { useState, useRef, useEffect } from "react";
import { Melody } from "@/melody";
import { Button } from "@/components/Button";
import { CiPlay1 } from "react-icons/ci";
import { melodySerialize } from "@/melodyFormat";

function getNoteLabel(note: number): string {
    const letter = [
        "C ",
        "C#",
        "D ",
        "D#",
        "E ",
        "F ",
        "F#",
        "G ",
        "G#",
        "A ",
        "A#",
        "B ",
    ][note % 12];
    return `${letter}${Math.floor(note / 12)}`;
}

export const MelodyMaker = () => {
    const initialMelody = Array.from(
        { length: MELODY_SIZE },
        () => new Set([])
    );
    const [melody, setMelody] = useState<Set<number>[]>(initialMelody);

    const [wipMelody, setWipMelody] = useState<Melody>(melody);

    const melodyDisplayRef = useRef<HTMLDivElement | null>(null);

    const [placingNote, setPlacingNote] = useState<{
        t: number;
        note: number;
    } | null>(null);

    function updateWipMelody(startT: number, endT: number, note: number) {
        let melodyCow = melody.map((set) => new Set<number>([...set]));
        for (let i = Math.min(startT, endT); i <= Math.max(startT, endT); i++) {
            if (!melody[i].has(note)) {
                melodyCow[i].add(note);
            } else {
                melodyCow[i].delete(note);
            }
        }

        setWipMelody(melodyCow);
    }

    useEffect(() => {
        console.log("window eventlistener");
        function listener() {
            console.log("MOUSEUP");
            if (placingNote != null) {
                setMelody(wipMelody);
                setPlacingNote(null);
            }
        }
        window.addEventListener("mouseup", listener);
        return () => window.removeEventListener("mouseup", listener);
    });
    return (
        <>
            <MelodyDisplay
                ref={melodyDisplayRef}
                melody={wipMelody}
                onMouseDown={(note, t) => {
                    setPlacingNote({ note: note, t: t });
                    updateWipMelody(t, t, note);
                }}
                onMouseEnter={(t) => {
                    if (placingNote == null) {
                        return;
                    }
                    updateWipMelody(placingNote.t, t, placingNote.note);
                }}
                onMouseLeave={(t) => {}}
            />
            {/* {new Array(100).fill(0).map((_, i) => <div key={i}>{getNoteLabel(i)}</div>)} */}
            <Button onClick={
                () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/play-music`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "music_notes": melodySerialize(melody, SHORTEST_NOTE_DURATION_MS, 440 * Math.pow(Math.pow(2, 1/12), -5))
                    })
                })
            }>
                <CiPlay1 />
                Play
            </Button>
        </>
    );
};
