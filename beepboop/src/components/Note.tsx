export const Note = (props: {
    onMouseDown: () => void;
    onMouseUp: () => void;
    prevHasNote: boolean;
    hasNote: boolean;
    nextHasNote: boolean;
}) => {
    return (
        <div
            className="note"
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}>
            {props.hasNote ? (props.prevHasNote ? (props.nextHasNote ? "=" : ")") : (props.nextHasNote ? "(" : "O")) : "-"}
        </div>
    );
};
