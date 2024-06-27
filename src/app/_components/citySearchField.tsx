import { useEffect, useState } from "react";
import { City } from "_lib/types/types";
import useCities from "_lib/data/cities";
import { FaLocationArrow } from "react-icons/fa";

const CitySearchField = ({
    uiMode,
    value,
    onChange,
    onChangeUiMode,
}: {
    uiMode: string;
    value: City | null;
    onChange: (city: City) => void;
    onChangeUiMode: (uiMode: string) => void;
}): JSX.Element => {
    const cities = useCities();

    const [textValue, setTextValue] = useState(value?.name || "London, United Kingdom");
    const [results, setResults] = useState<(City | null)[]>([
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setTextValue(value?.name || "London, United Kingdom");
    }, [value]);

    useEffect(() => {
        if (textValue === searchText) return;
        const newResults: (City | null)[] = cities
            .search(textValue)
            .slice(0, 7)
            .map(r => r.item);
        while (newResults.length < 7) newResults.push(null);
        setResults(newResults);
        setSearchText(textValue);
    }, [textValue, uiMode, cities, searchText]);

    if (uiMode !== "location") {
        return (
            <div className="flex gap-2 items-center">
                <FaLocationArrow className="text-lg" />
                <span className="text-sm">{value?.name || "London, United Kingdom"}</span>
                <span
                    className="text-xs underline text-black text-opacity-50 cursor-pointer"
                    onClick={() => onChangeUiMode("location")}
                >
                    change
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 items-center w-[300px]">
            <div className="flex gap-2 items-center">
                <FaLocationArrow className="text-lg" />
                <span className="text-sm mr-[20px]">Enter a city name to search</span>
            </div>
            <input
                type="text"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                className="bg-primary-mid text-black text-lg rounded-lg px-4 pt-2 pb-1.5 w-full text-center"
            />
            <div className="flex flex-col gap-2 items-center w-full">
                {results.map((r, i) => (
                    <p
                        key={i}
                        onClick={() => {
                            if (!r) return;
                            setTextValue(r.name);
                            onChange(r);
                            onChangeUiMode("none");
                        }}
                        className="cursor-pointer select-none border-2 border-secondary-mid bg-secondary-dark bg-opacity-0 rounded-lg px-2 py-1 text-center hover:bg-opacity-30 w-full h-10 overflow-hidden grid place-items-center text-nowrap"
                    >
                        {r?.name || ""}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default CitySearchField;
