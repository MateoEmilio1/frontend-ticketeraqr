"use client";

import { User, Building2, Book } from "lucide-react";
import Link from "next/link";

export default function RegisterTypePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-3xl font-bold text-blue-600 hover:text-blue-700"
                    >
                        <Book className="w-10 h-10" />
                        <span>Ticketera</span>
                    </Link>
                    <h2 className="mt-8 text-4xl font-extrabold text-gray-900">
                        ¿Cómo querés registrarte?
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Seleccioná el tipo de cuenta que mejor se adapte a tus necesidades.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {/* Cliente */}
                    <Link
                        href="/register/client"
                        className="group relative bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-blue-200"
                    >
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                            <User className="w-10 h-10 text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Cliente</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Comprá entradas para tus eventos favoritos, gestioná tus tickets QR y viví experiencias inolvidables.
                        </p>
                        <span className="mt-8 text-blue-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                            Registrarme como cliente →
                        </span>
                    </Link>

                    {/* Organización */}
                    <Link
                        href="/register/organization"
                        className="group relative bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-purple-200"
                    >
                        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                            <Building2 className="w-10 h-10 text-purple-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Organización</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Creá y gestioná tus propios eventos, vendé entradas de forma segura y accedé a estadísticas de ventas.
                        </p>
                        <span className="mt-8 text-purple-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                            Registrar mi organización →
                        </span>
                    </Link>
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600">
                        ¿Ya tenés una cuenta?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Iniciá sesión acá
                        </Link>
                    </p>
                    <Link
                        href="/"
                        className="inline-block mt-6 text-sm text-gray-400 hover:text-blue-600 transition-colors"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
