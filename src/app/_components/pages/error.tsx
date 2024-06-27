import { FaExclamationTriangle } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

const ErrorPage = ({ error, onClear }: { error: string; onClear: () => void }): JSX.Element => {
    return (
        <div
            className="w-full grid place-items-center"
            style={{
                height: "calc(100vh - 6rem)",
            }}
        >
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 relative">
                <FaExclamationTriangle className="text-red-800 text-[10rem]" />
                <p className="text-3xl text-center leading-none">{error}</p>
                <button
                    className="font-aleo text-xl bg-secondary-mid w-72 rounded-lg grid place-items-center px-4 mx-auto mt-6 border-b-2 border-r-2 border-primary-dark border-opacity-20"
                    onClick={onClear}
                >
                    <span className="relative top-0.5">Oh ok</span>
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
