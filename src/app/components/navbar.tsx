"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Rol } from "@/types/usuario";


export default function Navbar() {
  const pathname = usePathname();
  const [rol, setRol] = useState<Rol | null>(null);

  useEffect(() => {
    const storedRol = localStorage.getItem("rol") as Rol | null;
    console.log('storedRol: ', storedRol)
    setRol(storedRol);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-medium ${
      isActive(href)
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
                <Link href="/categorias" className={linkClass("/categorias")}>
                  Categorías
                </Link>
                <Link href="/contacto" className={linkClass("/contacto")}>
                  Contacto
                </Link>
              </>
            )}

            {rol === "ADMIN" && (
              <>
                <Link
                  href="/admin/categorias"
                  className={linkClass("/admin/categorias")}
                >
                  Mis categorías
                </Link>
                <Link
                  href="/admin/politicas"
                  className={linkClass("/admin/politicas")}
                >
                  Establecer políticas
                </Link>
              </>
            )}

            {rol === "CLIENTE" && (
              <>
                <Link href="/categorias" className={linkClass("/categorias")}>
                  Categorías
                </Link>
                <Link href="/mis-tickets" className={linkClass("/mis-tickets")}>
                  Mis tickets
                </Link>
              </>
            )}

          </div>

          {/* Derecha */}
          <div className="w-24 h-6 border rounded" />
        </div>
      </div>
    </nav>
  );
}
