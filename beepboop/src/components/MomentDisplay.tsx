import { Moment } from "@/melody";
import { Note } from "@/components/Note";
import { MIN_NOTE, MAX_NOTE, COL_PX } from "@/constants";

export const MomentDisplay = (props: {
    t: number;
    moment: Moment;
    onMouseDown: (note: number) => void;
    onMouseUp: (note: number) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) => {
    // const notesUpper = Array.from(props.moment.filter(note => note > MAX_NOTE);
    // const notesLower = props.moment.filter(note => note < MIN_NOTE);
    // const notesMiddle = props.moment.filter(note => note >= MIN_NOTE && note <= MAX_NOTE);

    const highestNote =
        props.moment.size > 0
            ? Array.from(props.moment).reduce((a, b) => (a > b ? a : b))
            : null;
    const lowestNote =
        props.moment.size > 0
            ? Array.from(props.moment).reduce((a, b) => (a < b ? a : b))
            : null;

    return (
        <div
            className="moment"
            onMouseEnter={() => props.onMouseEnter()}
            onMouseLeave={() => props.onMouseLeave()}>
            {new Array(MAX_NOTE - MIN_NOTE + 1).fill(0).map((_, i) => (
                <Note
                    key={i}
                    hasNote={props.moment.has(MAX_NOTE - i)}
                    onMouseDown={() => props.onMouseDown(MAX_NOTE - i)}
                    onMouseUp={() => props.onMouseUp(MAX_NOTE - i)}
                />
            ))}
            {highestNote != null && highestNote > MAX_NOTE ? (
                <div className="upper-extension">
                    {new Array(highestNote - MAX_NOTE).fill(0).map((_, i) => (
                        <Note
                            key={i}
                            hasNote={props.moment.has(highestNote - i)}
                            onMouseDown={() =>
                                props.onMouseDown(highestNote - i)
                            }
                            onMouseUp={() => props.onMouseUp(highestNote - i)}
                        />
                    ))}
                </div>
            ) : (
                <></>
            )}
            {lowestNote != null && lowestNote < MIN_NOTE ? (
                <div className="lower-extension">
                    {new Array(MIN_NOTE - lowestNote).fill(0).map((_, i) => (
                        <Note
                            key={i}
                            hasNote={props.moment.has(MIN_NOTE - 1 - i)}
                            onMouseDown={() =>
                                props.onMouseDown(MIN_NOTE - 1 - i)
                            }
                            onMouseUp={() =>
                                props.onMouseDown(MIN_NOTE - 1 - i)
                            }
                        />
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
