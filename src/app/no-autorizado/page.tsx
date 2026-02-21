"use client";

import Link from "next/link";
import { ShieldX, LogIn, ArrowLeft } from "lucide-react";

export default function NoAutorizado() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-5 rounded-full">
                        <ShieldX className="w-14 h-14 text-red-500" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Acceso Restringido
                </h1>

                {/* Message */}
                <p className="text-gray-500 text-base mb-2 leading-relaxed">
                    Para acceder a esta página necesitás iniciar sesión como
                    <span className="font-semibold text-gray-700"> usuario autorizado</span>.
                </p>
                <p className="text-gray-400 text-sm mb-8">
                    Si ya tenés una cuenta, iniciá sesión para continuar.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <LogIn className="w-5 h-5" />
                        Iniciar Sesión
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
