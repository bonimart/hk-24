import { Moment } from "@/melody";
import { Note } from "@/components/Note";
import { MIN_NOTE, MAX_NOTE, COL_PX } from "@/constants";

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

export const NoteLabelDisplay = (props: {
    minNote: number | null,
    maxNote: number | null,
}) => {
    // const notesUpper = Array.from(props.moment.filter(note => note > MAX_NOTE);
    // const notesLower = props.moment.filter(note => note < MIN_NOTE);
    // const notesMiddle = props.moment.filter(note => note >= MIN_NOTE && note <= MAX_NOTE);

    const highestNote = props.maxNote;
    const lowestNote = props.minNote;

    return (
        <div className="moment" style={{ width: `${4 * COL_PX}px` }}>
            {new Array(MAX_NOTE - MIN_NOTE + 1).fill(0).map((_, i) => (
                <div className="note">{getNoteLabel(MAX_NOTE - i)}</div>
            ))}
            {highestNote != null && highestNote > MAX_NOTE ? (
                <div className="upper-extension">
                    {new Array(highestNote - MAX_NOTE).fill(0).map((_, i) => (
                        <div className="note">{getNoteLabel(highestNote - i)}</div>
                    ))}
                </div>
            ) : (
                <></>
            )}
            {lowestNote != null && lowestNote < MIN_NOTE ? (
                <div className="lower-extension">
                    {new Array(MIN_NOTE - lowestNote).fill(0).map((_, i) => (
                        <div className="note">{getNoteLabel(MAX_NOTE - 1 - i)}</div>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
