import { WeatherHistogram } from "./types/types";

export const buildHistogram = (data: number[], numBins: number): WeatherHistogram => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;
    const bins = Array.from({ length: numBins }, (_, i) => {
        const binMin = min + i * binWidth;
        const binMax = binMin + binWidth;
        const count = data.filter(d => d >= binMin && d < binMax).length;
        return { min: binMin, max: binMax, count };
    });
    const maxCount = Math.max(...bins.map(b => b.count));
    return { min, max, maxCount, bins };
};
