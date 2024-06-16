"use client";

import {
    TimePeriod,
    TypeUtils,
    WeatherRequest,
    WeatherVariable,
    timePeriods,
    weatherVariables,
} from "_lib/types/types";
import { FaLocationArrow } from "react-icons/fa";
import RequestSelect from "_components/requestSelect";
import { useState } from "react";

const RequestForm = ({ onSubmit }: { onSubmit: (data: WeatherRequest) => void }): JSX.Element => {
    const [data, setData] = useState<WeatherRequest>({
        location: {
            lat: 51.5074,
            lon: 0.1278,
        },
        timePeriod: "day",
        variable: "hot",
    });

    return (
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col gap-10">
                <div className="flex justify-center">
                    <div className="flex gap-2 items-center">
                        <FaLocationArrow className="text-lg" />
                        <span className="text-sm">London, UK</span>
                        <span className="text-xs underline text-black text-opacity-50">change</span>
                    </div>
                </div>
                <div className="flex flex-col text-4xl text-center">
                    <span>Is</span>
                    <RequestSelect
                        value={data.timePeriod}
                        onChange={val =>
                            setData(cur => ({ ...cur, timePeriod: val as TimePeriod }))
                        }
                        options={timePeriods.reduce(
                            (acc, cur) => ({ ...acc, [cur]: TypeUtils.timePeriodDisplay(cur) }),
                            {} as Record<string, string>
                        )}
                    />
                    <span>any</span>
                    <RequestSelect
                        value={data.variable}
                        onChange={val =>
                            setData(cur => ({ ...cur, variable: val as WeatherVariable }))
                        }
                        options={weatherVariables.reduce(
                            (acc, cur) => ({
                                ...acc,
                                [cur]: TypeUtils.weatherVariableDisplay(cur),
                            }),
                            {} as Record<string, string>
                        )}
                    />
                    <span>than normal?</span>
                </div>
                <button
                    className="font-aleo text-3xl bg-secondary-mid rounded-lg grid place-items-center px-4 mx-auto mt-6 border-b-2 border-r-2 border-primary-dark border-opacity-20"
                    onClick={() => onSubmit(data)}
                >
                    Find Out
                </button>
            </div>
        </div>
    );
};

export default RequestForm;
