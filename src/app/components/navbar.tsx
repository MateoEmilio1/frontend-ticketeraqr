"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              className="cursor-pointer"
            />
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link href="/eventos" className="text-gray-700 hover:text-black">
              Mis eventos
            </Link>
            <Link href="/categorias" className="text-gray-700 hover:text-black">
              Categorías
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-black">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
