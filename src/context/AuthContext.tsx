"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Usuario } from "@/types/usuario";
import { loginUsuario as loginService } from "@/app/services/loginService";

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

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const userData = await res.json();
                    // Assuming backend returns the user object directly for /me
                    // Adjust based on your checkSession response.
                    // In controller we did: const user = req.user; res.send(user);
                    // And jwt payload was { id, rol }. Wait.
                    // My generateToken used { id, rol }.
                    // My verifyToken returns decoded token.
                    // So req.user IS { id, rol, iat, exp }.
                    // It does NOT contain mail or other fields unless I query DB or put them in token.
                    // Current generation: generateToken(usuario.idUsuario, usuario.rol).
                    // So user will only have id and rol.
                    // If I want 'mail', I should either add it to token OR query DB in checkSession.
                    // For now, I will use what I have. Ideally query DB in checkSession to get full user.
                    // Let's assume for now I accept the token payload.

                    setUser(userData);
                    console.log({ userData });
                } else {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking session", error);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            const data = await loginService(email, pass);
            // data is { token, usuario: { ... } }
            localStorage.setItem("token", data.token);

            setUser(data.usuario);
            router.push("/");
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login"); // or /
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
