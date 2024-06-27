const RequestSelect = ({
    value,
    onChange,
    options,
    onUiModeChange,
    uiMode,
    targetMode,
}: {
    value: string;
    onChange: (newVal: string) => void;
    options: Record<string, string>;
    onUiModeChange: (uiMode: string) => void;
    uiMode: string;
    targetMode: string;
}): JSX.Element => {
    return (
        <>
            <span
                className={`${uiMode === targetMode ? "hidden" : uiMode === "none" ? "grid" : "hidden"} bg-primary-mid rounded-lg border-t-2 border-l-2 border-primary-dark border-opacity-20 w-[300px] text-center h-[75px] place-items-center cursor-pointer`}
                onClick={() => {
                    onUiModeChange(targetMode);
                }}
            >
                {options[value]}
            </span>
            <div
                className={`${uiMode !== targetMode ? "hidden" : "flex"} flex-col justify-center relative top-[49px]`}
            >
                <span
                    className={`absolute -top-[75px] place-items-center h-[75px] w-full overflow-visible text-nowrap grid`}
                >
                    {/* {`Select ${targetMode === "timePeriod" ? "window" : "weather"}`} */}
                    Select {targetMode === "timePeriod" ? "window" : "weather"}
                </span>
                {Object.entries(options).map(([key, val], i) => (
                    <span
                        key={key}
                        className={`relative bg-primary-mid rounded-lg border-t-2 border-l-2 border-primary-dark border-opacity-20 w-[300px] cursor-pointer ${
                            key === value ? "bg-secondary-mid" : ""
                        }`}
                        style={{
                            transition: "all 0.3s",
                            top: uiMode !== targetMode ? `-${i * 75}px` : "0",
                        }}
                        onClick={() => {
                            onChange(key);
                            onUiModeChange("none");
                        }}
                    >
                        {val}
                    </span>
                ))}
            </div>
        </>
    );
};

export default RequestSelect;
