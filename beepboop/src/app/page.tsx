"use client";

import Image from "next/image";
import { Melody, Moment } from "@/melody";
import { forwardRef, useEffect, useRef, useState } from "react";

function getNoteLabel(note: number): string {
    const letter = ["C ", "C#", "D ", "D#", "E ", "F ", "F#", "G ", "G#", "A ", "A#", "B "][note % 12];
    return `${letter}${Math.floor(note / 12)}`;
}

const MIN_NOTE = 50;
const MAX_NOTE = 63;
const COL_PX = 12;

function Note(props: { onMouseDown: () => void, onMouseUp: () => void, hasNote: boolean }) {
    return <div
        className="note"
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
    >{props.hasNote ? "O" : "-"}</div>
}

function MomentDisplay(props: {
    t: number, moment: Moment,
    onMouseDown: (note: number) => void,
    onMouseUp: (note: number) => void,
    onMouseEnter: () => void,
    onMouseLeave: () => void,
}) {
    // const notesUpper = Array.from(props.moment.filter(note => note > MAX_NOTE);
    // const notesLower = props.moment.filter(note => note < MIN_NOTE);
    // const notesMiddle = props.moment.filter(note => note >= MIN_NOTE && note <= MAX_NOTE);

    const highestNote = props.moment.size > 0 ? Array.from(props.moment).reduce((a, b) => a > b ? a : b) : null;
    const lowestNote = props.moment.size > 0 ? Array.from(props.moment).reduce((a, b) => a < b ? a : b) : null;

    return <div className="moment" style={{ width: `${COL_PX}px` }} onMouseEnter={() => props.onMouseEnter()} onMouseLeave={() => props.onMouseLeave()}>
        {new Array(MAX_NOTE - MIN_NOTE + 1).fill(0).map(
            (_, i) => <Note 
                key={i} hasNote={props.moment.has(MAX_NOTE - i)}
                onMouseDown={() => props.onMouseDown(MAX_NOTE - i)}
                onMouseUp={() => props.onMouseUp(MAX_NOTE - i)}
            />
        )}
        {(highestNote != null && highestNote > MAX_NOTE) ? <div className="upper-extension">{
            new Array(highestNote - MAX_NOTE).fill(0).map(
                (_, i) => <Note
                    key={i} hasNote={props.moment.has(highestNote - i)}
                    onMouseDown={() => props.onMouseDown(highestNote - i)}
                    onMouseUp={() => props.onMouseUp(highestNote - i)}
                />
            )
        }</div> : <></>}
        {(lowestNote != null && lowestNote < MIN_NOTE) ? <div className="lower-extension">{
            new Array(MIN_NOTE - lowestNote).fill(0).map(
                (_, i) => <Note
                    key={i} hasNote={props.moment.has(MIN_NOTE - 1 - i)}
                    onMouseDown={() => props.onMouseDown(MIN_NOTE - 1 - i)}
                    onMouseUp={() => props.onMouseDown(MIN_NOTE - 1 - i)}
                />
            )
        }</div> : <></>}
    </div>
}

const MelodyDisplay = forwardRef(
    (props: {
        melody: Melody,
        onMouseDown: (note: number, t: number) => void,
        onMouseEnter: (t: number) => void,
        onMouseLeave: (t: number) => void,
    }, ref: any) => {
        return <div ref={ref}>
            {
                props.melody.map(
                    (moment, i) => <MomentDisplay
                        key={i}
                        moment={moment}
                        t={i}
                        onMouseDown={note => props.onMouseDown(note, i)} 
                        onMouseEnter={() => props.onMouseEnter(i)}
                        onMouseLeave={() => props.onMouseLeave(i)}
                        onMouseUp={() => {}}
                    />
                )
            }
        </div>;
    }
);

export default function Home() {
    const [melody, setMelody] = useState<Melody>([
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
        new Set([]),
    ]);

    const [wipMelody, setWipMelody] = useState<Melody>(melody);

    const melodyDisplayRef = useRef<HTMLDivElement | null>(null);

    const [placingNote, setPlacingNote] = useState<{ t: number, note: number } | null>(null);

    function updateWipMelody(startT: number, endT: number, note: number) {
        let melodyCow = melody;
        for (let i = Math.min(startT, endT); i <= Math.max(startT, endT); i++) {
            if (!melodyCow[i].has(note)) {
                if (melodyCow == melody) {
                    melodyCow = Array.from(melodyCow);
                }
                melodyCow[i] = new Set(melodyCow[i]);
                melodyCow[i].add(note);
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

    return <div style={{ textAlign: "center", marginTop: "3cm" }}>
        <MelodyDisplay
            ref={melodyDisplayRef}
            melody={wipMelody}
            onMouseDown={(note, t) => {
                setPlacingNote({ note: note, t: t });
                updateWipMelody(t, t, note);
            }}
            onMouseEnter={t => {
                if (placingNote == null) {
                    return;
                }
                updateWipMelody(placingNote.t, t, placingNote.note);
            }}
            onMouseLeave={t => {}}
        />
        {/* {new Array(100).fill(0).map((_, i) => <div key={i}>{getNoteLabel(i)}</div>)} */}
    </div>;
}
