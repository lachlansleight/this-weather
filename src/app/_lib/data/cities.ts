import { City, Coordinate } from "_lib/types/types";
import { data } from "./citiesData";
import Fuse from "fuse.js";

const citiesData: City[] = data
    .slice(1)
    .split("\n")
    .map(line => {
        const pieces = line.split("\t");
        return {
            name: pieces[0] + ", " + pieces[1],
            location: {
                lat: parseFloat(pieces[2]),
                lon: parseFloat(pieces[3]),
            },
            population: parseInt(pieces[4]),
        };
    });

const cities = new Fuse(citiesData, {
    includeScore: true,
    keys: ["name"],
    minMatchCharLength: 3,
    distance: 0,
    sortFn: (a, b) => {
        if (Math.abs(a.score - b.score) < 0.02) {
            const popA = citiesData[a.idx].population;
            const popB = citiesData[b.idx].population;
            return popB - popA;
        }
        return a.score - b.score;
    },
});

export default cities;
