import { Melody } from "@/melody";
import { forwardRef } from "react";
import { MomentDisplay } from "./MomentDisplay";
import { NoteLabelDisplay } from "./NoteLabelDisplay";

export const MelodyDisplay = forwardRef(
    (
        props: {
            melody: Melody;
            onMouseDown: (note: number, t: number) => void;
            onMouseEnter: (t: number) => void;
            onMouseLeave: (t: number) => void;
        },
        ref: any
    ) => {
        return (
            <div ref={ref}>
                <NoteLabelDisplay
                    minNote={props.melody.reduce<number | null>(
                        (prev, curr) => Array.from(curr).reduce(
                            (p: number | null, c) => p != null ? Math.max(p, c) : c, null), null
                        )
                    }
                    maxNote={props.melody.reduce<number | null>(
                        (prev, curr) => Array.from(curr).reduce(
                            (p: number | null, c) => p != null ? Math.min(p, c) : c, null), null
                        )
                    }
                />
                {props.melody.map((moment, i) => (
                    <MomentDisplay
                        key={i}
                        moment={moment}
                        t={i}
                        onMouseDown={(note) => props.onMouseDown(note, i)}
                        onMouseEnter={() => props.onMouseEnter(i)}
                        onMouseLeave={() => props.onMouseLeave(i)}
                        onMouseUp={() => {}}
                    />
                ))}
            </div>
        );
    }
);
