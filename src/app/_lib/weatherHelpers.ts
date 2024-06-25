import { fetchWeatherApi } from "openmeteo";
import {
    Coordinate,
    TimePeriod,
    TypeUtils,
    WeatherResponseRawData,
    WeatherVariable,
    getSeason,
} from "./types/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const getForecast = async (coordinate: Coordinate, variable: WeatherVariable) => {
    const params = {
        latitude: coordinate.lat,
        longitude: coordinate.lon,
        hourly: TypeUtils.getWeatherVariableParams(variable, true),
        past_days: 5,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            t => new Date((t + utcOffsetSeconds) * 1000)
        ),
        data: hourly.variables(0)!.valuesArray()!,
    };

    const days: {
        date: string;
        data: number[];
        average: number;
        sum: number;
        min: number;
        max: number;
    }[] = [];
    weatherData.time.forEach((timeStr, i) => {
        const date = timeStr.toISOString().split("T")[0];
        let index = days.findIndex(d => d.date === date);
        if (index === -1) {
            days.push({
                date,
                data: [],
                average: 0,
                min: 0,
                max: 0,
                sum: 0,
            });
            index = days.length - 1;
        }
        days[index].data.push(weatherData.data[i]);
    });
    days.forEach(day => {
        day.average = day.data.reduce((a, b) => a + b, 0) / day.data.length;
        day.sum = day.data.reduce((a, b) => a + b, 0);
        day.min = Math.min(...day.data);
        day.max = Math.max(...day.data);
    });

    const finalData: WeatherResponseRawData = [];
    days.forEach(day => {
        let data = 0;
        switch (variable) {
            case "hot":
            case "cold":
                data = day.max;
                break;
            case "wet":
            case "dry":
                data = day.sum;
                break;
            case "windy":
                data = day.max;
                break;
        }
        finalData.push({
            time: day.date,
            value: data,
        });
    });

    return finalData;
};

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export const getHistory = async (coordinate: Coordinate, variable: WeatherVariable) => {
    let baseUrl = `https://archive-api.open-meteo.com/v1/archive`;
    const fiveDaysAgo = dayjs().subtract(5, "day").format("YYYY-MM-DD");
    const params = TypeUtils.getWeatherVariableParams(variable);
    const response = (
        await fetchWeatherApi(baseUrl, {
            latitude: coordinate.lat,
            longitude: coordinate.lon,
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
        time: time.toISOString().split("T")[0],
        value: values[i],
    }));

    return weatherData;
};

export const groupData = (
    data: WeatherResponseRawData,
    timePeriod: TimePeriod,
    variable: WeatherVariable
) => {
    const groupedData: Record<string, { time: string; values: number[] }> = {};
    for (let i = 0; i < data.length; i++) {
        let key = "";
        switch (timePeriod) {
            case "day":
                key = data[i].time;
                break;
            case "week":
                key = dayjs(data[i].time, "YYYY-MM-DD").startOf("week").format("YYYY-MM-DD");
                break;
            case "month":
                key = data[i].time.split("-").slice(0, 2).join("-");
                break;
            case "season":
                key = getSeason(dayjs(data[i].time).month()) + "-" + data[i].time.split("-")[0];
                break;
            case "year":
                key = data[i].time.split("-")[0];
                break;
        }
        if (!groupedData[key]) {
            groupedData[key] = {
                time: key,
                values: [data[i].value],
            };
        } else {
            groupedData[key].values.push(data[i].value);
        }
    }
    return Object.values(groupedData).map(d => ({
        time: d.time,
        value:
            variable === "wet" || variable === "dry"
                ? d.values.reduce((a, b) => a + b, 0)
                : d.values.reduce((a, b) => a + b, 0) / d.values.length,
    }));
};
