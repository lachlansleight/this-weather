import dayjs from "dayjs";

export const timePeriods: TimePeriod[] = ["day", "week", "month", "season", "year"];
export type TimePeriod = "day" | "week" | "month" | "season" | "year";
export const weatherVariables: WeatherVariable[] = ["hot", "cold", "windy", "wet", "dry"];
export type WeatherVariable = "hot" | "cold" | "windy" | "wet" | "dry";

export type Coordinate = {
    lat: number;
    lon: number;
};

export type WeatherRequest = {
    locationName: string;
    location: Coordinate;
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
    mean: number;
    sdUp: number;
    sdDown: number;
};

export type WeatherResponse = {
    timePeriod: TimePeriod;
    variable: WeatherVariable;
    rawData: WeatherResponseRawData;
    histogram: WeatherHistogram;
    thisPeriod: number;
    units: string;
};

export type City = {
    name: string;
    location: Coordinate;
    population: number;
};

export const getSeason = (month: number) => {
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
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

    static weatherVariableEst(
        variable: WeatherVariable,
        invert = false,
        capitalize = false
    ): string {
        if (invert) {
            if (variable === "hot") variable = "cold";
            else if (variable === "cold") variable = "hot";
            else if (variable === "wet") variable = "dry";
            else if (variable === "dry") variable = "wet";
        }
        switch (variable) {
            case "hot":
                return capitalize ? "Hottest" : "hottest";
            case "cold":
                return capitalize ? "Coldest" : "coldest";
            case "windy":
                return capitalize ? "Windiest" : "windiest";
            case "wet":
                return capitalize ? "Wettest" : "wettest";
            case "dry":
                return capitalize ? "Driest" : "driest";
        }
    }

    static getOrdinal(val: number): string {
        switch (val % 10) {
            case 1:
                return "single";
            case 2:
                return "second";
            case 3:
                return "third";
            case 4:
                return "fourth";
            case 5:
                return "fifth";
            case 6:
                return "sixth";
            case 7:
                return "seventh";
            case 8:
                return "eighth";
            case 9:
                return "ninth";
            default:
                return val + "th";
        }
    }

    static getWeatherVariableParams(variable: WeatherVariable, isForecast = false): string[] {
        switch (variable) {
            case "hot":
                return isForecast ? ["temperature_2m"] : ["temperature_2m_max"];
            case "cold":
                return isForecast ? ["temperature_2m"] : ["temperature_2m_max"];
            case "windy":
                return isForecast ? ["wind_gusts_10m"] : ["wind_gusts_10m_max"];
            case "wet":
                return isForecast ? ["precipitation"] : ["precipitation_sum"];
            case "dry":
                return isForecast ? ["precipitation"] : ["precipitation_sum"];
        }
    }

    static getHumanReadableHeader(data: WeatherResponse): string {
        let normalness =
            (data.thisPeriod - data.histogram.mean) /
            (data.thisPeriod > data.histogram.mean ? data.histogram.sdUp : data.histogram.sdDown);
        if (data.variable === "cold" || data.variable === "dry") normalness *= -1;
        if (normalness < -1) return "What are you on about?";
        else if (normalness < 0.25) return "It's just you.";
        return "It's not just you!";
    }

    static getHumanReadableReport(data: WeatherResponse): string {
        let report = "";
        let thisPeriodName = "";
        let thisVariableName = "";
        let thisWindowName = "";

        let normalness =
            (data.thisPeriod - data.histogram.mean) /
            (data.thisPeriod > data.histogram.mean ? data.histogram.sdUp : data.histogram.sdDown);
        if (data.variable === "cold" || data.variable === "dry") normalness *= -1;

        switch (data.timePeriod) {
            case "day":
                thisPeriodName = "Today";
                break;
            case "week":
                thisPeriodName = "This week";
                break;
            case "month":
                thisPeriodName = "This month";
                break;
            case "season":
                thisPeriodName = "This season";
                break;
            case "year":
                thisPeriodName = "This year";
                break;
        }

        switch (data.variable) {
            case "hot":
                thisVariableName = "hotter";
                break;
            case "cold":
                thisVariableName = "colder";
                break;
            case "dry":
                thisVariableName = "drier";
                break;
            case "wet":
                thisVariableName = "wetter";
                break;
            case "windy":
                thisVariableName = "windier";
                break;
        }

        const numberSmaller =
            data.variable === "cold" || data.variable === "dry"
                ? data.rawData.reduce((a, b) => a + (b.value > data.thisPeriod ? 1 : 0), 0)
                : data.rawData.reduce((a, b) => a + (b.value < data.thisPeriod ? 1 : 0), 0);
        const numberLarger = data.rawData.length - numberSmaller;
        const percentage = 100 * (numberSmaller / data.rawData.length);
        console.log({ numberSmaller, numberLarger });

        switch (data.timePeriod) {
            case "day":
                thisWindowName = `${dayjs().date() < 10 ? "early" : dayjs().date() > 20 ? "late" : "mid"} ${dayjs().format("MMMM")} days`;
                break;
            case "week":
                thisWindowName = `${dayjs().date() < 10 ? "early" : dayjs().date() > 20 ? "late" : "mid"} ${dayjs().format("MMMM")} weeks`;
                break;
            case "month":
                thisWindowName = `${dayjs().format("MMMM")}s`;
                break;
            case "season":
                thisWindowName = `${getSeason(dayjs().month())}s`;
                break;
            case "year":
                thisWindowName = `years`;
                break;
        }

        console.log(normalness);
        if (normalness < 0.25) {
            if (normalness < -0.5) {
                if (numberSmaller < 10) {
                    if (
                        (data.variable === "wet" || data.variable === "dry") &&
                        data.thisPeriod < 1
                    ) {
                        report = `In fact, it hasn't rained at all ${thisPeriodName.toLowerCase()}!`;
                    } else {
                        report = `In fact, ${thisPeriodName.toLowerCase()} is the is the ${this.getOrdinal(numberSmaller + 1)} ${this.weatherVariableEst(data.variable, true)} ${thisWindowName.substring(0, thisWindowName.length - 1)} on record!`;
                    }
                } else {
                    report = `In fact, ${(100 - percentage).toFixed(0)}% of ${thisWindowName} have been ${thisVariableName} than this one!`;
                }
            } else {
                if (Math.abs(percentage - 50) < 15) {
                    report = `${thisPeriodName} ${data.timePeriod === "day" ? "isn't" : "hasn't been"} any ${thisVariableName} than most ${thisWindowName} on record`;
                } else {
                    report = `${thisPeriodName} ${data.timePeriod === "day" ? "is" : "has been"} only ${thisVariableName} than ${percentage.toFixed(0)}% of ${thisWindowName} on record!`;
                }
            }
        } else {
            if (numberLarger < 10) {
                report = `In fact, ${thisPeriodName.toLowerCase()} is the is the ${this.getOrdinal(numberLarger + 1)} ${this.weatherVariableEst(data.variable)} ${thisWindowName.substring(0, thisWindowName.length - 1)} on record!`;
            } else {
                report = `${thisPeriodName} ${data.timePeriod === "day" ? "is" : "has been"} ${thisVariableName} than ${percentage.toFixed(0)}% of ${thisWindowName} on record!`;
            }
        }

        return report;
    }
}
