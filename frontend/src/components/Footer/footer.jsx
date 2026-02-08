import {ArrowUp} from "lucide-react";


export const Footer = () => {
    return (
        <footer className="py-8 px-4 bg-[#0D1B2A] border-t border-border  flex flex-wrap justify-between items-center">
            <div>
                <p className="text-sm text-[#E1E2E1]">
                    Prop.Manager. Built for property management
                    {" "}
                    &copy; {new Date().getFullYear()} - All rights reserved.
                </p>
            </div>

            <a
                href="#hero"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-[#E1E2E1] transition-colors">
                <ArrowUp size={20} />
            </a>
        </footer>
    );
};