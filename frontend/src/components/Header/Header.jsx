import {Folder, House, HouseHeart, LogOut, MessageCircle, UserRound} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useState} from "react";


export const Header = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        // Clear authentication token from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className="">
            <header className="flex flex-row justify-between items-center px-4 sm:px-6 py-3 bg-white shadow">
                <div className="flex text-xl sm:text-2xl md:text-[28px] items-center gap-2">
                    <HouseHeart className="stroke-blue-800 size-8 sm:size-12"/>
                    <div className="font-bold hidden sm:inline">Prop.Manager</div>
                    <div className="font-bold text-sm sm:hidden">PM</div>
                </div>

                <nav className="flex gap-1 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
                        <UserRound size={20} className="sm:size-[24px]"/>
                        <div className="font-medium hidden sm:inline text-sm">Profile</div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
                        <MessageCircle size={20} className="sm:size-[24px]"/>
                        <div className="font-medium hidden sm:inline text-sm">Messages</div>
                    </div>
                    <div 
                        onClick={handleLogout}
                        className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-red-100 p-2 rounded-2xl text-red-600"
                    >
                        <LogOut size={20} className="sm:size-[20px]"/>
                        <div className="font-medium hidden sm:inline text-sm">Logout</div>
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
                        <div
                            onClick={handleLogout}
                            className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-red-100 p-2 rounded-2xl text-red-600"
                        >
                            <LogOut size={20} className="sm:size-[20px]"/>
                            <div className="font-medium hidden sm:inline text-sm">Logout</div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}