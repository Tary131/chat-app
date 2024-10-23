import { FC, ReactNode } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import ProfileSheet from '../pages/Profile/profileSheet';
interface MainPageProps {
  left: ReactNode;
  right: ReactNode;
}

const MainPage: FC<MainPageProps> = ({ left, right }) => {
  return (
    <div className="h-screen relative">
      <ResizablePanelGroup direction="horizontal">
        {/* Left panel */}
        <ResizablePanel defaultSize={25} >
          {left}
        </ResizablePanel>

        {/* Resizable handle */}
        <ResizableHandle withHandle />

        {/* Right panel */}
        <ResizablePanel defaultSize={75} >
          {right}
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Profile sheet */}
      <div className="absolute right-0 top-0 p-4">
        <ProfileSheet />
      </div>
    </div>
  );
};

export default MainPage;
