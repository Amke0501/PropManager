import {Folder, House, HouseHeart, MessageCircle, UserRound} from "lucide-react";


export const Header = () => {
    return (
        <div className="">
            <header className="flex flex-row justify-between items-center">
                <div className="flex text-[28px] items-center">
                    <HouseHeart className="stroke-blue-800 size-12"/>
                    <div className="font-bold">Prop.Manager</div>
                </div>

                <nav className="flex gap-3">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
                        <UserRound/>
                        <div className="font-medium">Profile</div>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
                        <MessageCircle/>
                        <div className="font-medium">Profile</div>
                    </div>
                </nav>
            </header>
        </div>
    )
}