import { fetchWeatherApi } from "openmeteo";
import {
    TypeUtils,
    WeatherRequest,
    WeatherResponse,
    WeatherResponseRawData,
    getSeason,
} from "_lib/types/types";
import dayjs from "dayjs";
import Server from "next/server";
import { buildHistogram } from "_lib/histogram";
import { getForecast, getHistory, groupData } from "_lib/weatherHelpers";

import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const POST = async (req: Request) => {
    //get json data
    const data: WeatherRequest = await req.json();

    const today = dayjs();
    let rawForecastData = await getForecast(data.location, data.variable);
    const forecastData = rawForecastData.filter(v => {
        return dayjs(v.time, "YYYY-MM-DD").isBefore(today);
    });
    const rawHistoryData = await getHistory(data.location, data.variable);
    const historyData = rawHistoryData.filter(v => {
        let simDate = dayjs(v.time);

        if (data.timePeriod === "month") {
            return simDate.month() === today.month();
        } else if (data.timePeriod === "season") {
            return getSeason(simDate.month()) === getSeason(today.month());
        } else if (data.timePeriod === "year") {
            return (
                simDate.diff(simDate.startOf("year"), "day") <=
                today.diff(today.startOf("year"), "day")
            );
        }

        //otherwise we use the current rough time of year
        let yearOffset = 0;
        const thisMonth = today.get("month");
        const thatMonth = simDate.get("month");
        if (Math.abs(thisMonth - thatMonth) > 6) {
            yearOffset = thisMonth > thatMonth ? 1 : -1;
        }
        simDate = simDate.set("year", today.get("year") + yearOffset);
        return simDate.isAfter(today.subtract(7, "day")) && simDate.isBefore(today.add(7, "day"));
    });
    //return Server.NextResponse.json(historyData);
    const allData: WeatherResponseRawData = [...historyData, ...forecastData];
    const groupedData = groupData(allData, data.timePeriod, data.variable);

    const histogram = buildHistogram(groupedData, 20);
    const fullResponse: WeatherResponse = {
        timePeriod: data.timePeriod,
        variable: data.variable,
        units:
            data.variable === "windy"
                ? "km/h"
                : data.variable === "cold" || data.variable === "hot"
                  ? "°C"
                  : "mm",
        rawData: groupedData,
        thisPeriod: groupedData[groupedData.length - 1].value,
        histogram,
    };
    return Server.NextResponse.json(fullResponse);
};
