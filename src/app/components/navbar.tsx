"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";


export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const rol = user?.rol;

  if (pathname === "/login") return null;
  if (!user) return null;

  const isActive = (href: string) => pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-medium ${isActive(href)
      ? "border-b-2 border-gray-800 text-gray-900 pb-1"
      : "text-gray-500 hover:text-black"
    }`;

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={40}
              priority
            />
          </Link>

          {/* Links */}
          <div className="flex gap-8">

            {rol === "ORGANIZACION" && (
              <>
                <Link href="/eventos" className={linkClass("/eventos")}>
                  Mis eventos
                </Link>
                <Link href="/organizaciones/scan" className={linkClass("/organizaciones/scan")}>
                  Escanear
                </Link>
                <Link href="/contacto" className={linkClass("/contacto")}>
                  Contacto
                </Link>
              </>
            )}

            {rol === "ADMIN" && (
              <>
                <Link
                  href="/categorias"
                  className={linkClass("/categorias")}
                >
                  Mis categorías
                </Link>
                <Link
                  href="/politicas"
                  className={linkClass("/politicas")}
                >
                  Establecer políticas
                </Link>
              </>
            )}

            {rol === "CLIENTE" && (
              <>
                <Link href="/clientes/mis-tickets" className={linkClass("/clientes/mis-tickets")}>
                  Mis tickets
                </Link>
              </>
            )}

            {rol && (
              <Link href="/perfil" className={linkClass("/perfil")}>
                Mi Perfil
              </Link>
            )}
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-4">
            <Link href="/perfil" className="p-2 text-gray-600 hover:text-indigo-600 transition-colors bg-gray-50 rounded-full">
              <User className="h-6 w-6" />
            </Link>
            <button
              onClick={logout}
              className={`text-sm font-medium text-gray-500 hover:text-black`}
            >
              Cerrar sesión
            </button>
            <div className="w-24 h-6 border rounded" />
          </div>
        </div>
      </div>
    </nav>
  );
}
