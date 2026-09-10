import React, { createContext, useState } from "react";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("userInfo")) || null;
        } catch {
            return null;
        }
    });
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
    }
    return (
        <authContext.Provider value={{ user, login, logout }}>
            {children}
        </authContext.Provider>
    );
}