import {
  Folder,
  House,
  HouseHeart,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export const HomeHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute w-full z-40 flex justify-center items-center pt-20 ">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-col text-[32px] text-[#E1E2E1] items-center">
          <HouseHeart className="stroke-[#1B3B6F] size-32" />
          <div className="font-bold">Prop.Manager</div>
        </div>

          {/*<nav className="flex gap-3 nav-visibility">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
            <div className="font-medium">Sign up</div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
            <div className="font-medium">Login</div>
          </div>
        </nav>*/}
      </header>
    </div>
  );
};
