import { useEffect } from 'react';
import MainPage from '@/pages/MainPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import RegisterForm from '@/pages/auth/Register/RegisterForm';
import RootLayout from '@/app/layout';
import LoginForm from '@/pages/auth/Login/LoginForm';
import ChatList from '@/pages/Sidebar/ChatList';
import ChatWindow from '@/pages/Chat/ChatWindow.tsx';
import {
  initializeUserPresence,
  cleanupUserPresence,
} from '@/services/userServices';

const App = () => {
  const props = {
    left: <ChatList />,

    right: <ChatWindow />,
  };
  useEffect(() => {
    initializeUserPresence();

    return () => {
      cleanupUserPresence();
    };
  }, []);
  return (
    <RootLayout>
      <BrowserRouter>
        <Routes>
          {/* Protected Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPage {...props} />
              </ProtectedRoute>
            }
          />
          {/*Register ann Login Form */}
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    </RootLayout>
  );
};

export default App;
