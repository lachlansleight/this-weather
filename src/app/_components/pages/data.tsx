import Histogram from "_components/histogram";
import { TypeUtils, WeatherResponse } from "_lib/types/types";
import { FaShareAlt, FaDonate, FaGithub } from "react-icons/fa";

const DataPage = ({
    data,
    onClear,
}: {
    data: WeatherResponse;
    onClear: () => void;
}): JSX.Element => {
    return (
        <div
            className="flex flex-col gap-4 items-center w-full mt-16"
            style={{
                height: "calc(100vh - 10rem)",
            }}
        >
            <h2 className="text-center text-3xl font-aleo w-full mx-8 leading-none">
                {TypeUtils.getHumanReadableHeader(data)}
            </h2>
            <p className="text-center text-2xl w-full mx-8 mb-4 leading-none">
                {TypeUtils.getHumanReadableReport(data)}
                <br />
                <span className="text-md">(since 1970)</span>
            </p>
            <Histogram
                data={data.histogram}
                units={data.units}
                current={{
                    label: TypeUtils.timePeriodDisplay(data.timePeriod),
                    value: data.thisPeriod,
                }}
            />
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <button
                className="font-aleo text-xl bg-secondary-mid w-72 rounded-lg grid place-items-center px-4 mx-auto mt-6 border-b-2 border-r-2 border-primary-dark border-opacity-20"
                onClick={onClear}
            >
                <span className="relative top-0.5">Try Another</span>
            </button>
            <div className="flex justify-between w-48 text-2xl mt-2">
                <FaShareAlt />
                <FaDonate />
                <FaGithub />
            </div>
        </div>
    );
};

export default DataPage;
