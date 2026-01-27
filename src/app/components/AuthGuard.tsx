"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check if running on client side
        if (typeof window === "undefined") return;

        const rol = localStorage.getItem("rol");
        const publicRoutes = ["/login", "/registro"]; // Add other public routes if needed

        if (!rol && !publicRoutes.includes(pathname)) {
            setAuthorized(false);
            router.push("/login");
        } else {
            setAuthorized(true);
        }
    }, [router, pathname]);

    if (!authorized && !["/login", "/registro"].includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
