import { City } from "_lib/types/types";
import { data } from "./citiesData";
import Fuse from "fuse.js";
import { useMemo } from "react";

const useCities = () => {
    const cities = useMemo(() => {
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

        const fuseCities = new Fuse(citiesData, {
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

        return fuseCities;
    }, []);

    return cities;
};

export default useCities;
