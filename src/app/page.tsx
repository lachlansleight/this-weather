"use client";

import RequestForm from "_components/requestForm";
import { TypeUtils, WeatherRequest, WeatherResponse } from "_lib/types/types";
import axios from "axios";
import { useEffect, useState } from "react";

import debugData from "_lib/data/debugData.json";
import Histogram from "_components/histogram";
import { FaDonate, FaGithub, FaShareAlt } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

export default function MainPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<WeatherResponse | null>(null);

    useEffect(() => {
        //setData(debugData as any);
    }, []);

    const handleSubmit = async (data: WeatherRequest) => {
        setLoading(true);
        const res = await axios.post("/api/weather", data);
        console.log(res.data);
        setData(res.data);
        setLoading(false);
    };

    if(loading) {
        return (
            <div className="w-full grid place-items-center" style={{
                height: "calc(100vh - 4rem)"
            }}>
                <div className="w-full h-full flex flex-col gap-4 relative">
                    <div className="absolute left-0 top-0 w-full h-full grid place-items-center">
                        <VscLoading className="animate-[spin_1.5s_linear_infinite] text-[10rem]" />
                    </div>
                    <div className="absolute left-0 top-0 w-full h-full grid place-items-center">
                        <VscLoading className="animate-[spin_1s_linear_infinite_reverse] text-[8rem]" />
                    </div>
                    <div className="absolute left-0 top-0 w-full h-full grid place-items-center">
                        <VscLoading className="animate-[spin_1.85s_linear_infinite] text-[6rem]" />
                    </div>
                    <div className="absolute left-0 top-[6rem] w-full h-full grid place-items-center">
                        <p className="text-3xl text-center">Let&apos;s see...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (data) {
        return (
            <div className="flex flex-col gap-4 items-center w-full mt-16">
                <h2 className="text-center text-3xl font-aleo w-full mx-8">
                    {TypeUtils.getHumanReadableHeader(data)}
                </h2>
                <p className="text-center text-2xl w-full mx-8 mb-4 leading-none">
                    {TypeUtils.getHumanReadableReport(data)}
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
