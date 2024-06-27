import { WeatherHistogram } from "./types/types";

export const buildHistogram = (
    data: (number | { value: number })[],
    numBins: number
): WeatherHistogram => {
    const values: number[] = data.map(d => (typeof d === "number" ? d : d.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const upValues = values.filter(v => v > mean);
    const downValues = values.filter(v => v <= mean);
    const sdUp = Math.sqrt(upValues.reduce((a, b) => a + (b - mean) ** 2, 0) / upValues.length);
    const sdDown = Math.sqrt(
        downValues.reduce((a, b) => a + (b - mean) ** 2, 0) / downValues.length
    );
    const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
    const binWidth = (max - min) / numBins;
    const bins = Array.from({ length: numBins }, (_, i) => {
        const binMin = min + i * binWidth;
        const binMax = binMin + binWidth;
        const count = values.filter(d => d >= binMin && d < binMax).length;
        return { min: binMin, max: binMax, count };
    });
    const maxCount = Math.max(...bins.map(b => b.count));
    //note - not using sdup and sddown, but we could...
    const histogram: WeatherHistogram = { min, max, maxCount, bins, mean, sdUp: sd, sdDown: sd };
    return histogram;
};
