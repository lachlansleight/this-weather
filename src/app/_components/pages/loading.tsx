import { VscLoading } from "react-icons/vsc";

const LoadingPage = (): JSX.Element => {
    return (
        <div
            className="w-full grid place-items-center"
            style={{
                height: "calc(100vh - 6rem)",
            }}
        >
            <div className="w-full h-full flex flex-col gap-4 relative">
                <div className="absolute left-0 top-0 w-full h-full grid place-items-center">
                    <VscLoading className="animate-[spin_1.5s_linear_infinite] text-[10rem]" />
                </div>
                <div className="absolute left-0 top-0 w-full h-full grid place-items-center">
                    <VscLoading className="animate-[spin_1s_linear_infinite_reverse] text-[8rem]" />
                </div>
                <div className="absolute left-0 top-0 w-full h-full grid place-items-center">
                    <VscLoading className="animate-[spin_1.85s_linear_infinite] text-[6rem]" />
                </div>
                <div className="absolute left-0 top-[6rem] w-full h-full grid place-items-center">
                    <p className="text-3xl text-center">Let&apos;s see...</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;
