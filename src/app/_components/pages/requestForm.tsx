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
        location: {
            lat: 51.5074,
            lon: 0.1278,
        },
        timePeriod: "day",
        variable: "hot",
    });

    useEffect(() => {
        const savedCity = localStorage.getItem("city");
        console.log({ savedCity });
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
        console.log("city changed", city);
        if (!city) return;
        setData(cur => ({ ...cur, location: city.location }));
        localStorage.setItem("city", JSON.stringify(city));
    }, [city]);

    const [uiMode, setUiMode] = useState("none");

    return (
        <div
            className="grid place-items-center"
            style={{
                height: `calc(100vh - 6rem)`,
            }}
        >
            <div className="flex flex-col gap-10">
                <div className="flex justify-center">
                    <CitySearchField
                        uiMode={uiMode}
                        value={city}
                        onChange={setCity}
                        onChangeUiMode={setUiMode}
                    />
                </div>
                {uiMode === "none" && (
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
                )}
                {uiMode === "location" && (
                    <div
                        style={{
                            height: 142,
                        }}
                    />
                )}
                <button
                    className="font-aleo text-3xl bg-secondary-mid rounded-lg grid place-items-center px-4 mx-auto mt-6 border-b-2 border-r-2 border-primary-dark border-opacity-20"
                    onClick={() => {
                        if (uiMode === "none") onSubmit(data);
                        else if (uiMode === "location") setUiMode("none");
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
