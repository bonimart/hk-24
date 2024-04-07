"use client";

import { MelodyDisplay } from "@/components/MelodyDisplay";
import { MELODY_SIZE, SHORTEST_NOTE_DURATION_MS } from "@/constants";
import { useState, useRef, useEffect } from "react";
import { Melody } from "@/melody";
import { Button } from "@/components/Button";
import { NumberInput } from "./NumberInput";
import { CiPlay1 } from "react-icons/ci";
import { melodySerialize } from "@/melodyFormat";
import { inBrowserPlay } from "@/inBrowserPlay";

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

    const [bpm, setBpm] = useState<number>(120);

    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

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
            <div style={{ display: "flex" }}>
                <NumberInput value={bpm} onChange={val => setBpm(val)} label="BPM" />
                <Button onClick={
                    () => {
                        if (audioContext != null) {
                            audioContext.close();
                        }
                        setAudioContext(
                            inBrowserPlay(melodySerialize(melody, 60000 / bpm, 440 * Math.pow(Math.pow(2, 1/12), -5)))
                        );
                    }
                }>
                    <CiPlay1 />
                    Test
                </Button>
                <Button onClick={
                    () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/play-music`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "music_notes": melodySerialize(melody, 60000 / bpm, 440 * Math.pow(Math.pow(2, 1/12), -5))
                        })
                    })
                }>
                    <CiPlay1 />
                    Send
                </Button>
            </div>
        </>
    );
};
