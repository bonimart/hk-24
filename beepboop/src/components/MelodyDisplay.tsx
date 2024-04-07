import { Melody } from "@/melody";
import { forwardRef } from "react";
import { MomentDisplay } from "./MomentDisplay";

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
