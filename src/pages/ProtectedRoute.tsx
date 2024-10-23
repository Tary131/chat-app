import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAuthToken } from '@/utils/cookieUtils.ts';
import { setAuthUserId, setFullDisplayName } from '@/redux/slices/authSlice.ts';
import { useAppDispatch } from '@/redux/hooks/reduxHooks.ts';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = getAuthToken();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user && token) {
        dispatch(setAuthUserId(user.uid));
        dispatch(setFullDisplayName(user.displayName));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        dispatch(setAuthUserId(null));
        dispatch(setFullDisplayName(null));
      }
    });

    return () => unsubscribe();
  }, [token, dispatch]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
