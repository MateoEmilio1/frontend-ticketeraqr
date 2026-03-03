"use client";

import React from "react";
import { LogIn, UserPlus, X } from "lucide-react";
import Link from "next/link";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-gray-100">
                <div className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={onClose}>
                    <X className="w-6 h-6" />
                </div>

                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">
                        ¡Casi lo tenés!
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Para comprar tickets debes iniciar sesión. <br />
                        Si aún no tienes una cuenta, regístrate para continuar.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200 active:scale-95"
                        >
                            <LogIn className="w-5 h-5" />
                            Iniciar Sesión
                        </Link>

                        <Link
                            href="/register/client"
                            className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <UserPlus className="w-5 h-5" />
                            Registrarme ahora
                        </Link>
                    </div>

                    <p className="mt-8 text-xs text-gray-400 font-medium">
                        Solo te llevará un minuto y tendrás acceso a todos tus tickets QR.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
