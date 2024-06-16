import "./globals.css";
import { Abyssinica_SIL, Aleo } from "next/font/google";

const abyssincina = Abyssinica_SIL({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-abyssinica",
});
const aleo = Aleo({
    weight: "700",
    subsets: ["latin"],
    variable: "--font-aleo",
});

export const metadata = {
    title: "This Weather",
    description: "A simple app to determine how unusual the current weather is.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`bg-primary-light text-black ${abyssincina.variable} ${aleo.variable}`}
            >
                <div className="w-full max-w-md mx-auto stretch px-4 md:px-0 mb-4 font-abyssinica">
                    {children}
                </div>
            </body>
        </html>
    );
}
