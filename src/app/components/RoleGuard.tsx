"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Rol } from "@/types/usuario";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Rol[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/");
            } else if (user.rol && !allowedRoles.includes(user.rol)) {
                router.push("/no-autorizado");
            }
        }
    }, [user, loading, allowedRoles, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user || (user.rol && !allowedRoles.includes(user.rol))) {
        return null;
    }

    return <>{children}</>;
}
