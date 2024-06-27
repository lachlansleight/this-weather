"use client";

import {
    City,
    TimePeriod,
    TypeUtils,
    WeatherRequest,
    WeatherVariable,
    timePeriods,
    weatherVariables,
} from "_lib/types/types";
import { FaLocationArrow } from "react-icons/fa";
import RequestSelect from "_components/requestSelect";
import { useEffect, useState } from "react";
import CitySearchField from "_components/citySearchField";

const RequestForm = ({ onSubmit }: { onSubmit: (data: WeatherRequest) => void }): JSX.Element => {
    const [city, setCity] = useState<City | null>(null);
    const [data, setData] = useState<WeatherRequest>({
        locationName: "London",
        location: {
            lat: 51.5074,
            lon: 0.1278,
        },
        timePeriod: "day",
        variable: "hot",
    });

    useEffect(() => {
        const savedCity = localStorage.getItem("city");
        if (!savedCity) {
            setCity({
                name: "London, United Kingdom",
                location: {
                    lat: 51.5074,
                    lon: 0.1278,
                },
                population: 9000000,
            });
        } else setCity(JSON.parse(savedCity));
    }, []);

    useEffect(() => {
        if (!city) return;
        setData(cur => ({
            ...cur,
            location: city.location,
            locationName: city.name.split(", ").slice(0, -1).join(", "),
        }));
        localStorage.setItem("city", JSON.stringify(city));
    }, [city]);

    const [uiMode, setUiMode] = useState("none");

    return (
        <div
            className="grid place-items-center w-[24rem] mx-auto"
            style={{
                height: `calc(100vh - 6rem)`,
            }}
        >
            <div className="flex flex-col gap-10">
                <div
                    className={`${uiMode === "none" || uiMode === "location" ? "flex" : "hidden"} justify-center`}
                >
                    <CitySearchField
                        uiMode={uiMode}
                        value={city}
                        onChange={setCity}
                        onChangeUiMode={setUiMode}
                    />
                </div>
                <div
                    className={`${uiMode !== "location" ? "flex" : "hidden"} flex-col text-4xl text-center`}
                >
                    {uiMode === "none" && (
                        <span
                            className={`${uiMode === "none" ? "grid" : "hidden"} place-items-center h-[75px]`}
                        >
                            Is
                        </span>
                    )}
                    <RequestSelect
                        value={data.timePeriod}
                        onChange={val =>
                            setData(cur => ({ ...cur, timePeriod: val as TimePeriod }))
                        }
                        options={timePeriods.reduce(
                            (acc, cur) => ({ ...acc, [cur]: TypeUtils.timePeriodDisplay(cur) }),
                            {} as Record<string, string>
                        )}
                        uiMode={uiMode}
                        onUiModeChange={setUiMode}
                        targetMode="timePeriod"
                    />
                    {uiMode === "none" && (
                        <span
                            className={`${uiMode === "none" ? "grid" : "hidden"} place-items-center h-[73px]`}
                        >
                            any
                        </span>
                    )}
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
                        uiMode={uiMode}
                        onUiModeChange={setUiMode}
                        targetMode="variable"
                    />
                    {uiMode === "none" && (
                        <span
                            className={`${uiMode === "none" ? "grid" : "hidden"} place-items-center h-[75px]`}
                        >
                            than normal?
                        </span>
                    )}
                </div>
                <button
                    className={`${uiMode === "none" || uiMode === "location" ? "block" : "hidden"} font-aleo text-3xl ${uiMode === "none" ? "bg-secondary-mid" : "bg-neutral-300"} rounded-lg grid place-items-center px-4 mx-auto border-b-2 border-r-2 border-primary-dark border-opacity-20`}
                    style={{
                        marginTop: uiMode === "none" ? "1rem" : "calc(2rem - 2px)",
                    }}
                    onClick={() => {
                        if (uiMode === "none") onSubmit(data);
                        else setUiMode("none");
                    }}
                >
                    <span className="relative top-1">
                        {uiMode === "none" ? "Find Out" : ""}
                        {uiMode === "location" ? "Cancel" : ""}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default RequestForm;
