"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Usuario } from "@/types/usuario";
import { loginUsuario, logoutUsuario, checkSession } from "@/app/services/loginService";

interface AuthContextType {
    user: Usuario | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const verifySession = async () => {
        try {
            const userData = await checkSession();
            // Normalizar: asegurar que idUsuario e id existan para compatibilidad
            const normalizedUser = {
                ...userData,
                idUsuario: userData.idUsuario || userData.id,
                id: userData.id || userData.idUsuario
            };
            setUser(normalizedUser);
        } catch (error) {
            // Silence session error for public users
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifySession();
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            await loginUsuario(email, pass);
            // After successful login, check session to get user data
            await verifySession();
            router.push("/");
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUsuario();
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
            // Force local logout anyway
            setUser(null);
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
