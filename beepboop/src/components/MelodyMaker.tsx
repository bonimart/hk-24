"use client";

import { MelodyDisplay } from "@/components/MelodyDisplay";
import { MELODY_SIZE, SHORTEST_NOTE_DURATION_MS } from "@/constants";
import { useState, useRef, useEffect } from "react";
import { Melody } from "@/melody";
import { Button } from "@/components/Button";
import { NumberInput } from "./NumberInput";
import { CiMusicNote1, CiPlay1, CiStop1, CiTrash } from "react-icons/ci";
import { melodySerialize } from "@/melodyFormat";
import { inBrowserPlay } from "@/inBrowserPlay";

const INITIAL_MELODY = Array.from(
    { length: MELODY_SIZE },
    () => new Set([])
);

export const MelodyMaker = () => {

    const [melody, setMelody] = useState<Set<number>[]>(INITIAL_MELODY);

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
                {audioContext == null ?
                    <Button
                        onClick={
                            () => setAudioContext(
                                inBrowserPlay(melodySerialize(melody, 60000 / bpm, 440 * Math.pow(Math.pow(2, 1/12), -5)))
                            )
                        }
                    >
                        <CiMusicNote1 />
                        Test
                    </Button> : <Button
                        onClick={
                            () => {
                                audioContext.close();
                                setAudioContext(null);
                            }
                        }
                    >
                        <CiStop1 />
                        Stop
                    </Button>
                }
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
                <Button onClick={() => { setMelody(INITIAL_MELODY); setWipMelody(INITIAL_MELODY); }}>
                    <CiTrash />
                    Clear
                </Button>
            </div>
        </>
    );
};
