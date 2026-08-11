import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error loading user session from localStorage:", error);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            if (response.data.success) {
                // Extract accessToken along with user data
                const { user: userData, accessToken } = response.data.data;
                
                // Save accessToken to localStorage for Axios Interceptor
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                }
                localStorage.setItem('user', JSON.stringify(userData));
                
                setUser(userData);
                return userData;
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };
    
    const register = async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
             console.error("Registration failed:", error);
            throw error;
        }
    };
    
    const registerWorker = async (formData) => {
        try {
            const response = await api.post('/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
             console.error("Worker registration failed:", error);
            throw error;
        }
    }

    const updateUser = (newUserData) => {
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error("Logout request failed, clearing data locally.", error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken'); // Clear token on logout
            navigate('/');
        }
    };

    const authValue = {
        user,
        loading,
        login,
        register,
        registerWorker,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};