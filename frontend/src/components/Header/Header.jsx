import {Folder, House, HouseHeart, LogOut, MessageCircle, UserRound} from "lucide-react";
import { useNavigate } from "react-router-dom";


export const Header = () => {
    const navigate = useNavigate();

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
            </header>
        </div>
    )
}