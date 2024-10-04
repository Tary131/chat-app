import MainPage from '@/pages/MainPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import RegisterForm from '@/pages/auth/Register/RegisterForm.tsx';
import RootLayout from '@/app/layout.tsx';
import LoginForm from '@/pages/auth/Login/LoginForm.tsx';


const App = () => {
  const props = {
    left: (
      <div></div>
    ),
    right: <div>Right Section</div>,
  };
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
