import { WeatherHistogram } from "_lib/types/types";
import GaussianCurve from "./gaussianCurve";

const Histogram = ({
    data,
    units,
    current,
}: {
    data: WeatherHistogram;
    units: string;
    current: { label: string; value: number };
}) => {
    const binWidth = 100 / data.bins.length;
    const binPadding = 4;

    return (
        <div className="relative grow w-full">
            <div
                className="absolute bottom-8 h-[70%]"
                style={{
                    width: "80%",
                    left: "10%",
                }}
            >
                {/* <GaussianCurve className="text-primary-dark absolute" strokeWidth={3} style={{
                    width: `95%`,
                    height: "95%",
                    bottom: 0,
                    left: `calc(-50% + (${data.mean - data.min} / ${data.max - data.min} * 100%))`
                }} /> */}
                {data.bins.map((bin, i) => {
                    const lerpFactor = (bin.min - data.min) / (data.max - data.min);
                    const lerpColor = (from: number[], to: number[], factor: number) => {
                        return `rgb(${from.map((v, i) => v + (to[i] - v) * factor).join(", ")})`;
                    };
                    let backgroundColor = "rgb(0, 0, 0)";
                    if (units === "mm")
                        backgroundColor = lerpColor([197, 155, 124], [51, 7, 175], lerpFactor);
                    else if (units === "km/h")
                        backgroundColor = lerpColor([41, 68, 94], [29, 150, 9], lerpFactor);
                    else backgroundColor = lerpColor([56, 104, 177], [175, 67, 7], lerpFactor);
                    return (
                        <div
                            key={i}
                            className="group rounded-tl-full rounded-tr-full absolute bottom-0"
                            style={{
                                left: `calc(${lerpFactor * 100}% + ${binPadding * 0.5}px)`,
                                width: `calc(${binWidth}% - ${binPadding}px)`,
                                height: `${(bin.count / data.maxCount) * 100}%`,
                                backgroundColor,
                            }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute left-0 w-full overflow-visible -bottom-6 text-center">
                                <span className="text-center text-md relative -left-4">
                                    {((bin.min + bin.max) / 2).toFixed(1)}
                                    {units}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="absolute bottom-8 bg-black w-full h-[2px]" />
            <span className="absolute bottom-0 left-[10%] text-center text-lg">
                {data.min.toFixed(1)}
                {units}
            </span>
            <span className="absolute bottom-0 right-[10%] text-center text-lg">
                {data.max.toFixed(1)}
                {units}
            </span>

            {current && (
                <div className="absolute w-[80%] left-[10%] h-full">
                    <div
                        className="absolute z-10 w-48 h-full pointer-events-none"
                        style={{
                            left: `calc((${((current.value - data.min) / (data.max - data.min)) * 100}%) - 6rem + ${binPadding * 0.5}px)`,
                            transition: "all 0.3s",
                        }}
                    >
                        <span className="absolute -top-2 text-2xl w-full text-center font-aleo text-secondary-dark">
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
                            className="absolute rounded-full bg-primary-light w-[16px] h-[16px]"
                            style={{
                                left: `calc(50% - 8px)`,
                                top: "46px",
                            }}
                        />
                        <div
                            className="absolute rounded-full bg-secondary-dark w-[12px] h-[12px]"
                            style={{
                                left: `calc(50% - 6px)`,
                                top: "48px",
                            }}
                        />
                        <div
                            className="absolute rounded-full bg-primary-light w-[16px] h-[16px]"
                            style={{
                                left: `calc(50% - 8px)`,
                                bottom: "calc(2rem - 8px)",
                            }}
                        />
                        <div
                            className="absolute rounded-full bg-secondary-dark w-[12px] h-[12px]"
                            style={{
                                left: `calc(50% - 6px)`,
                                bottom: "calc(2rem - 6px)",
                            }}
                        />
                        <div
                            className="absolute bg-secondary-dark w-[4px] h-full z-6"
                            style={{
                                height: "calc(100% - 84px)",
                                left: `calc(50% - 2px)`,
                                top: "48px",
                            }}
                        />
                        <span className="absolute -bottom-8 text-2xl w-full text-center font-aleo text-secondary-dark">
                            {current.value.toFixed(1)}
                            {units === "°C" ? "" : " "}
                            {units}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Histogram;
