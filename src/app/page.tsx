"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { TimePeriod, WeatherRequest, WeatherResponse, WeatherVariable } from "_lib/types/types";

import RequestForm from "_components/pages/requestForm";
import LoadingPage from "_components/pages/loading";
import DataPage from "_components/pages/data";
import { useRouter } from "next/navigation";
import ErrorPage from "_components/pages/error";

export default function MainPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState<WeatherRequest | null>(null);
    const [data, setData] = useState<WeatherResponse | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = useCallback(
        async (data: WeatherRequest) => {
            setLoading(true);
            setRequest(data);
            setError("");
            const res = await axios.post("/api/weather", data);
            if (res.data.error) {
                setError(res.data.error);
                setLoading(false);
                return;
            }
            router.push(
                "?city=" +
                    data.locationName +
                    "&lat=" +
                    data.location.lat +
                    "&lon=" +
                    data.location.lon +
                    "&time=" +
                    data.timePeriod +
                    "&var=" +
                    data.variable
            );
            console.log(res.data);
            setData(res.data);
            setLoading(false);
        },
        [router]
    );

    useEffect(() => {
        const query = window.location.search;
        const params = new URLSearchParams(query);
        const locationName = params.get("city") || "";
        const lat = params.get("lat");
        const lon = params.get("lon");
        const time = params.get("time");
        const varName = params.get("var");
        if (
            time !== "day" &&
            time !== "week" &&
            time !== "month" &&
            time !== "season" &&
            time !== "year"
        ) {
            return;
        }
        if (
            varName !== "hot" &&
            varName !== "cold" &&
            varName !== "windy" &&
            varName !== "hot" &&
            varName !== "dry"
        ) {
            return;
        }
        if (lat && lon && time && varName) {
            handleSubmit({
                locationName,
                location: { lat: parseFloat(lat), lon: parseFloat(lon) },
                timePeriod: time as TimePeriod,
                variable: varName as WeatherVariable,
            });
        }
    }, [handleSubmit]);

    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage error={error} onClear={() => setError("")} />;
    if (data && request)
        return <DataPage request={request} data={data} onClear={() => setData(null)} />;
    // if (data) return <DataPage data={{
    //     ...data,
    //     thisPeriod: 29,
    // }} onClear={() => {
    //     setData(null);
    //     router.push("/");
    // }} />;
    return <RequestForm onSubmit={handleSubmit} />;
}
