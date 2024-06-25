import { WeatherHistogram } from "_lib/types/types";

const Histogram = ({
    data,
    units,
    current,
}: {
    data: WeatherHistogram;
    units: string;
    current: { label: string; value: number };
}) => {
    return (
        <div className="relative h-[24rem] w-full">
            <div className="absolute bottom-8 bg-black w-full h-[2px]" />
            <div
                className="absolute bottom-8 h-[70%]"
                style={{
                    width: "80%",
                    left: "10%",
                }}
            >
                {data.bins.map((bin, i) => {
                    const binWidth = 100 / data.bins.length;
                    const binPadding = 4;
                    return (
                        <div
                            key={i}
                            className="group rounded-tl-full rounded-tr-full bg-tertiary-dark hover:bg-tertiary-mid absolute bottom-0"
                            style={{
                                left: `calc(${((bin.min - data.min) / (data.max - data.min)) * 100}% + ${binPadding * 0.5}px)`,
                                width: `calc(${binWidth}% - ${binPadding}px)`,
                                height: `${(bin.count / data.maxCount) * 100}%`,
                            }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute left-0 w-full overflow-visible -bottom-6 text-center">
                                <span className="text-center text-md relative -left-4">
                                    {((bin.min + bin.max) / 2).toFixed(1)}{units}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <span className="absolute bottom-0 left-[10%] text-center text-lg">
                {data.min.toFixed(1)}
                {units}
            </span>
            <span className="absolute bottom-0 right-[10%] text-center text-lg">
                {data.max.toFixed(1)}
                {units}
            </span>

            {current && (
                <div
                    className="absolute z-10 w-48 h-full pointer-events-none"
                    style={{
                        left: `calc((${((current.value - data.min) / (data.max - data.min)) * 100}%) - 6rem)`,
                        transition: "all 0.3s",
                    }}
                >
                    <span className="absolute top-0 text-2xl w-full text-center font-aleo text-secondary-dark">
                        {current.label}
                    </span>
                    <div
                        className="absolute bg-primary-light w-[8px] h-full z-5"
                        style={{
                            height: "calc(100% - 72px)",
                            left: `calc(50% - 4px)`,
                            top: "48px",
                        }}
                    />
                    <div
                        className="absolute bg-secondary-dark w-[4px] h-full z-6"
                        style={{
                            height: "calc(100% - 72px)",
                            left: `calc(50% - 2px)`,
                            top: "48px",
                        }}
                    />
                    <div
                        className="absolute rounded-full bg-secondary-dark w-[24px] h-[24px]"
                        style={{
                            left: `calc(50% - 12px)`,
                            bottom: "calc(2rem - 12px)",
                        }}
                    />
                    <span className="absolute -bottom-6 text-2xl w-full text-center font-aleo text-secondary-dark">
                        {current.value.toFixed(1)}
                        {units}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Histogram;
