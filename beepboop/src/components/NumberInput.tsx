
export const NumberInput = (props: {
    onChange: (val: number) => void,
    value: number,
    label: string,
}) => {
    return <div style={{ position: "relative" }}>
        <input
            type="number"
            onChange={e => props.onChange(Number(e.currentTarget.value))} value={props.value}
            style={{ width: "3cm" }}
            className="input"
        />
        <span className="input-label">{props.label}</span>
    </div>
};
