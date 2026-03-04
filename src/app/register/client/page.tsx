"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClienteForm } from "@/app/components/clienteForm";
import { createCliente } from "@/app/services/clientService";
import { ClienteFormData } from "@/types/cliente";
import { Book, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ClientRegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (data: ClienteFormData) => {
        setLoading(true);
        setError(null);
        try {
            await createCliente(data);
            alert("¡Registro exitoso! Ya podés iniciar sesión.");
            router.push("/login");
        } catch (err: any) {
            if (err.isValidationError) {
                // Let the form handle field-level validation errors natively
                throw err;
            }
            setError((err as Error)?.message || "Ocurrió un error al registrar el cliente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700"
                    >
                        <Book className="w-8 h-8" />
                        <span>Ticketera</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Crear cuenta de Cliente
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Completá tus datos para empezar a disfrutar de los mejores eventos.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <ClienteForm
                            isEditing={false}
                            onSubmit={handleRegister}
                            loading={loading}
                        />
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/register"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Elegir otro tipo de cuenta
                    </Link>
                </div>
            </div>
        </div>
    );
}
