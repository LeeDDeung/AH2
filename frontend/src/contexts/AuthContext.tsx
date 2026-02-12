import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage on mount
        const storedRole = localStorage.getItem('userRole');
        if (storedRole && (storedRole === 'PATIENT' || storedRole === 'DOCTOR' || storedRole === 'PLANNER')) {
            setUser({ role: storedRole as UserRole });
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (role: UserRole) => {
        localStorage.setItem('userRole', role);
        setUser({ role });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('userRole');
        setUser(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
