import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Loader from './Loaders/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallbackPath = "/" 
}) => {
  const { isAuthenticated, isLoading } = useContext(UserContext);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard; 