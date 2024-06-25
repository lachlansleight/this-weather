const GaussianCurve = ({
    className = "",
    style = {},
    width = 100,
    height = 100,
    strokeWidth = 2,
}: {
    className?: string;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    strokeWidth?: number;
}): JSX.Element => {
    return (
        <svg
            className={className || "text-white"}
            style={style || {}}
            width={width}
            height={height}
            viewBox="0 0 219 184"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 183C55.25 183 55.25 1 109.5 1C163.75 1 163.75 183 218 183"
                stroke="currentColor"
                stroke-width={strokeWidth}
                stroke-linecap="round"
            />
        </svg>
    );
};

export default GaussianCurve;
