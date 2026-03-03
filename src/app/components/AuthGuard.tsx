"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
        const isPublicRoute = publicRoutes.some(route =>
            pathname === route || (route !== "/" && pathname.startsWith(route))
        );

        if (!user && !isPublicRoute) {
            router.push("/login");
        }

        // Redirigir fuera de login/registro si ya está autenticado
        if (user && (pathname === "/login" || pathname.startsWith("/register"))) {
            router.push("/");
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If not user and not public, we are redirecting, so return null
    const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || (route !== "/" && pathname.startsWith(route))
    );

    if (!user && !isPublicRoute) {
        return null;
    }

    return <>{children}</>;
}
