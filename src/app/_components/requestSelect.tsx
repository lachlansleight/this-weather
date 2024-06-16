const RequestSelect = ({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (newVal: string) => void;
    options: Record<string, string>;
}): JSX.Element => {
    return (
        <span
            className="bg-primary-mid rounded-lg border-t-2 border-l-2 border-primary-dark border-opacity-20"
            onClick={() => {
                const curIndex = Object.keys(options).indexOf(value);
                const newIndex = (curIndex + 1) % Object.keys(options).length;
                onChange(Object.keys(options)[newIndex]);
            }}
        >
            {options[value]}
        </span>
    );
};

export default RequestSelect;
