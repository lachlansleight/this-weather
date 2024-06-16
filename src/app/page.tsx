"use client";

import RequestForm from "_components/requestForm";
import { TypeUtils, WeatherRequest, WeatherResponse } from "_lib/types/types";
import axios from "axios";
import { useEffect, useState } from "react";

import debugData from "_lib/data/debugData.json";
import Histogram from "_components/histogram";
import { FaDonate, FaGithub, FaShareAlt } from "react-icons/fa";

export default function MainPage() {
    const [data, setData] = useState<WeatherResponse | null>(null);

    useEffect(() => {
        //setData(debugData as any);
    }, []);

    const handleSubmit = async (data: WeatherRequest) => {
        const res = await axios.post("/api/weather", data);
        console.log(res.data);
        setData(res.data);
    };

    if (data) {
        return (
            <div className="flex flex-col gap-4 items-center w-full mt-16">
                <h2 className="text-center text-3xl font-aleo w-full mx-8">
                    It&apos;s not just you!
                </h2>
                <p className="text-center text-2xl w-full mx-8 mb-4 leading-none">
                    The week has been colder than 80% of weeks around this time of year since the
                    year 1940!
                </p>
                <Histogram
                    data={data.histogram}
                    units={data.units}
                    current={{
                        label: TypeUtils.timePeriodDisplay(data.timePeriod),
                        value: data.thisPeriod,
                    }}
                />
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                <button
                    className="font-aleo text-xl bg-secondary-mid w-72 rounded-lg grid place-items-center px-4 mx-auto mt-6 border-b-2 border-r-2 border-primary-dark border-opacity-20"
                    onClick={() => setData(null)}
                >
                    Try Another
                </button>
                <div className="flex justify-between w-48 text-2xl mt-2">
                    <FaShareAlt />
                    <FaDonate />
                    <FaGithub />
                </div>
            </div>
        );
    }

    return <RequestForm onSubmit={handleSubmit} />;
}
