import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAuthToken } from '@/utils/cookieUtils.ts';
import { setAuthUserId, setFullDisplayName } from '@/redux/slices/authSlice.ts';
import { useAppDispatch } from '@/redux/hooks/reduxHooks.ts';
import { updateUserStatus } from '@/services/userServices';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = getAuthToken();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const handleUserOffline = async () => {
        if (user) await updateUserStatus(user.uid, false); // Mark as offline
      };

      if (user && token) {
        // User is authenticated
        dispatch(setAuthUserId(user.uid));
        dispatch(setFullDisplayName(user.displayName));
        setIsAuthenticated(true);

        // Set user as online in Firestore
        await updateUserStatus(user.uid, true);

        // Add event listener for page unload
        window.addEventListener('beforeunload', handleUserOffline);
      } else {
        // User is not authenticated
        setIsAuthenticated(false);
        dispatch(setAuthUserId(null));
        dispatch(setFullDisplayName(null));
      }

      return () => {
        handleUserOffline(); // Clean up: mark offline
        window.removeEventListener('beforeunload', handleUserOffline);
      };
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
