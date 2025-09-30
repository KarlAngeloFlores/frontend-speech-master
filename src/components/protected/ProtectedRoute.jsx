import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen';
import authService from '../../services/auth.service';
import ErrorPage from '../../pages/ErrorPage';

const ProtectedRoute = ({ children, allowedRoles }) => {

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authService.me();
                if ((user && allowedRoles.includes(user.role)) && user.status === 'verified') {
                    setIsAuthenticated(true);
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.log("Error checking authentication:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [allowedRoles]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorPage />;
    }

    if (!isAuthenticated ) {
        return <Navigate to="/auth" />;
    }

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" />;
    }

  return children;
}

export default ProtectedRoute