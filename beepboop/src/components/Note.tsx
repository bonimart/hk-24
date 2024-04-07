export const Note = (props: {
    onMouseDown: () => void;
    onMouseUp: () => void;
    hasNote: boolean;
}) => {
    return (
        <div
            className="note"
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}>
            {props.hasNote ? "O" : "-"}
        </div>
    );
};
