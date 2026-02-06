import {Folder, House, HouseHeart, MessageCircle, UserRound} from "lucide-react";
import {useState} from "react";


export const Header = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="">
            <header className="flex flex-row justify-between items-center">
                <div className="flex text-[28px] items-center">
                    <HouseHeart className="stroke-blue-800 size-12"/>
                    <div className="font-bold">Prop.Manager</div>
                </div>

                <nav className="flex gap-3 nav-visibility">
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
                            <UserRound/>
                            <div className="font-medium">Profile</div>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
                            <MessageCircle/>
                            <div className="font-medium">Messages</div>
                        </div>
                </nav>

                <div
                    className="sidebar-visibility text-3xl cursor-pointer select-none"
                    onClick={() => setOpen(true)}> ☰
                </div>

                {open && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setOpen(false)}
                    />
                )}


                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-black/90 backdrop-blur-md text-white
                    z-50 p-6 pt-24 transform transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}>
                    <button
                        className="absolute top-6 right-6 text-2xl cursor-pointer"
                        onClick={() => setOpen(false)}> ✕
                    </button>

                    <div className="flex flex-col gap-6 text-lg">
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 hover:text-black p-2 rounded-2xl">
                            <UserRound/>
                            <div className="font-medium">Profile</div>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 hover:text-black p-2 rounded-2xl">
                            <MessageCircle/>
                            <div className="font-medium">Messages</div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}