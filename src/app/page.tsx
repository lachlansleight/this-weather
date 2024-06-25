"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { WeatherRequest, WeatherResponse } from "_lib/types/types";

import RequestForm from "_components/pages/requestForm";
import LoadingPage from "_components/pages/loading";
import DataPage from "_components/pages/data";

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

    if (loading) return <LoadingPage />;
    if (data) return <DataPage data={data} onClear={() => setData(null)} />;
    return <RequestForm onSubmit={handleSubmit} />;
}
