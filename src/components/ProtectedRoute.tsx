import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from './SessionContextProvider';
import Header from './Header'; // Import the new Header component

const ProtectedRoute: React.FC = () => {
  const { session } = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;