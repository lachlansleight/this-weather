import { useEffect, useState } from "react";
import { City } from "_lib/types/types";
import cities from "_lib/data/cities";
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
    const [textValue, setTextValue] = useState(value?.name || "London, England");
    const [results, setResults] = useState<City[]>([]);

    useEffect(() => {
        const results = cities.search(textValue);
        setResults(results.slice(0, 5).map(r => r.item));
    }, [textValue, uiMode]);

    if (uiMode !== "location") {
        return (
            <div className="flex gap-2 items-center">
                <FaLocationArrow className="text-lg" />
                <span className="text-sm">{value?.name || "London, United Kingdom"}</span>
                <span
                    className="text-xs underline text-black text-opacity-50"
                    onClick={() => onChangeUiMode("location")}
                >
                    change
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 items-center">
            <input
                type="text"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                className="bg-primary-dark text-white rounded-lg px-4 pt-2 pb-1.5 w-72 font-abyssinica text-center"
            />
            <div className="flex flex-col gap-2 items-center">
                {results.map((r, i) => (
                    <p
                        key={i}
                        onClick={() => {
                            setTextValue(r.name);
                            onChange(r);
                            onChangeUiMode("none");
                        }}
                        className="bg-secondary-mid rounded-lg px-2 py-1 text-center hover:bg-secondary-dark hover:text-white"
                    >
                        {r.name}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default CitySearchField;
