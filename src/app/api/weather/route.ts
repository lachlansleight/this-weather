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

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export const POST = async (req: Request) => {
    //get json data
    const data: WeatherRequest = await req.json();

    let baseUrl = `https://archive-api.open-meteo.com/v1/archive`;
    const fiveDaysAgo = dayjs().subtract(5, "day").format("YYYY-MM-DD");
    const params = TypeUtils.getWeatherVariableParams(data.variable);
    const response = (
        await fetchWeatherApi(baseUrl, {
            latitude: data.location.lat,
            longitude: data.location.lon,
            start_date: "1970-01-01",
            end_date: fiveDaysAgo,
            daily: params,
        })
    )[0];
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const times = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        t => new Date((t + utcOffsetSeconds) * 1000)
    );
    const values: number[] = Array.from(daily.variables(0)?.valuesArray() || []);
    const weatherData: WeatherResponseRawData = times.map((time, i) => ({
        time: time.toISOString(),
        value: values[i],
    }));
    const histogram = buildHistogram(values, 20);
    const fullResponse: WeatherResponse = {
        timePeriod: data.timePeriod,
        variable: data.variable,
        units:
            data.variable === "windy"
                ? "km/h"
                : data.variable === "cold" || data.variable === "hot"
                  ? "°C"
                  : "mm",
        rawData: [],
        thisPeriod: values[values.length - 1],
        histogram,
    };
    return Server.NextResponse.json(fullResponse);
};
