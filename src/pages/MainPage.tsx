import { FC, ReactNode } from 'react';
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProfileSheet from "./Profile/profileSheet";

interface MainPageProps {
  left: ReactNode;
  right: ReactNode;

}

const MainPage: FC<MainPageProps> = ({ left, right }) => {
  return (
      <div className="h-screen grid grid-cols-5 gap-4 relative">
          {/* Left */}
          <div className="border-r-2 border-black col-span-1 p-4">{left}</div>

          {/* Right */}
          <div className="col-span-1 p-4">{right}</div>
          <div className="absolute right-0 top-0 p-4">
              <ProfileSheet />
          </div>
      </div>
  );
};

export default MainPage;
