import { fetchWeatherApi } from "openmeteo";
import {
    TypeUtils,
    WeatherRequest,
    WeatherResponse,
    WeatherResponseRawData,
} from "_lib/types/types";
import dayjs from "dayjs";
import Server from "next/server";
import { buildHistogram } from "_lib/histogram";
import { getForecast, getHistory } from "_lib/weatherHelpers";

import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);



export const POST = async (req: Request) => {
    //get json data
    const data: WeatherRequest = await req.json();

    const today = dayjs();
    let rawForecastData = (await getForecast(data.location, data.variable));
    const forecastData = rawForecastData.filter(v => {
        return dayjs(v.time, "YYYY-MM-DD").isBefore(today);
    });
    const rawHistoryData = await getHistory(data.location, data.variable);
    const historyData = rawHistoryData.filter(v => {
        let simDate = dayjs(v.time);
        let yearOffset = 0;
        const thisMonth = today.get("month");
        const thatMonth = simDate.get("month");
        if(Math.abs(thisMonth - thatMonth) > 6) {
            yearOffset = thisMonth > thatMonth ? 1 : -1;
        }
        simDate = simDate.set("year", today.get("year") + yearOffset);
        return simDate.isAfter(today.subtract(7, "day")) && simDate.isBefore(today.add(7, "day"));
    });
    //return Server.NextResponse.json(historyData);
    const allData = [...historyData, ...forecastData];

    
    const histogram = buildHistogram(allData, 20);
    const fullResponse: WeatherResponse = {
        timePeriod: data.timePeriod,
        variable: data.variable,
        units:
            data.variable === "windy"
                ? "km/h"
                : data.variable === "cold" || data.variable === "hot"
                  ? "°C"
                  : "mm",
        rawData: allData,
        thisPeriod: allData[allData.length - 1].value,
        histogram,
    };
    return Server.NextResponse.json(fullResponse);
};
