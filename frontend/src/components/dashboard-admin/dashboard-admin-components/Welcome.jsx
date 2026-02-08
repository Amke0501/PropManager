import {useEffect, useState} from "react";


export const Welcome = () => {
    const text = "Glad to see you User 👋";
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;

        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i));
            i++;

            if (i > text.length) clearInterval(interval);
        }, 120);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-[130%] gotu-bold font-medium pb-5 text-[#E1E2E1]">
            {displayed}
            <span className="animate-pulse">...</span>
        </div>
    );
}