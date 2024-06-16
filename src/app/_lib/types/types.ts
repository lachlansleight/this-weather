export const timePeriods: TimePeriod[] = ["day", "week", "month", "season", "year"];
export type TimePeriod = "day" | "week" | "month" | "season" | "year";
export const weatherVariables: WeatherVariable[] = ["hot", "cold", "windy", "wet", "dry"];
export type WeatherVariable = "hot" | "cold" | "windy" | "wet" | "dry";

export type WeatherRequest = {
    location: {
        lat: number;
        lon: number;
    };
    timePeriod: TimePeriod;
    variable: WeatherVariable;
};

export type WeatherResponseRawData = {
    time: string;
    value: number;
}[];

export type WeatherHistogram = {
    min: number;
    max: number;
    maxCount: number;
    bins: {
        count: number;
        min: number;
        max: number;
    }[];
};

export type WeatherResponse = {
    timePeriod: TimePeriod;
    variable: WeatherVariable;
    rawData: WeatherResponseRawData;
    histogram: WeatherHistogram;
    thisPeriod: number;
    units: string;
};

export class TypeUtils {
    static timePeriodDisplay(timePeriod: TimePeriod, capitalize = false): string {
        switch (timePeriod) {
            case "day":
                return capitalize ? "Today" : "today";
            case "week":
                return capitalize ? "This Week" : "this week";
            case "month":
                return capitalize ? "This Month" : "this month";
            case "season":
                return capitalize ? "This Season" : "this season";
            case "year":
                return capitalize ? "This Year" : "this year";
        }
    }

    static weatherVariableDisplay(variable: WeatherVariable, capitalize = false): string {
        switch (variable) {
            case "hot":
                return capitalize ? "Hotter" : "hotter";
            case "cold":
                return capitalize ? "Colder" : "colder";
            case "windy":
                return capitalize ? "Windier" : "windier";
            case "wet":
                return capitalize ? "Wetter" : "wetter";
            case "dry":
                return capitalize ? "Drier" : "drier";
        }
    }

    static getWeatherVariableParams(variable: WeatherVariable): string[] {
        switch (variable) {
            case "hot":
                return ["temperature_2m_mean"];
            case "cold":
                return ["temperature_2m_mean"];
            case "windy":
                return ["wind_speed_10m_max", "wind_gusts_10m_max"];
            case "wet":
                return ["precipitation_sum", "precipitation_hours"];
            case "dry":
                return ["precipitation_sum", "precipitation_hours"];
        }
    }
}
