"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Book, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createOrganizacion } from "@/app/services/organizacionService";
import { OrganizacionFormData } from "@/types/organizacion";
// Validaciones de frontend eliminadas a favor de backend

export default function OrganizationRegisterPage() {
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<OrganizacionFormData>({
        defaultValues: {
            nombre: "",
            ubicacion: "",
            cuit: "",
            mail: "",
            contraseña: "",
            repetirContraseña: "",
        },
    });

    const onFormSubmit = async (data: OrganizacionFormData) => {
        setServerError(null);
        try {
            await createOrganizacion(data);
            alert("¡Organización registrada con éxito! Ya podés acceder a tu panel.");
            router.push("/login");
        } catch (err: any) {
            if (err.isValidationError && err.details) {
                err.details.forEach((issue: { path: string, message: string }) => {
                    let fieldName = issue.path;

                    if (fieldName === "body.nombre") fieldName = "nombre";
                    else if (fieldName === "body.cuit") fieldName = "cuit";
                    else if (fieldName === "body.ubicacion") fieldName = "ubicacion";
                    else if (fieldName === "body.mail") fieldName = "mail";
                    else if (fieldName === "body.contraseña") fieldName = "contraseña";
                    else if (fieldName === "body.repetirContraseña") fieldName = "repetirContraseña";

                    setError(fieldName as keyof OrganizacionFormData, {
                        type: "backend",
                        message: issue.message
                    });
                });
            } else {
                setServerError((err as Error)?.message || "Error al registrar la organización.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-2xl font-bold text-purple-600 hover:text-purple-700"
                    >
                        <Book className="w-8 h-8" />
                        <span>Ticketera</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Registrar Organización
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Unite a nosotros para empezar a crear y vender entradas para tus eventos.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-purple-500">
                    <div className="p-8">
                        {serverError && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
                                <p className="text-sm font-medium">{serverError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Nombre Legal
                                    </label>
                                    <input
                                        type="text"
                                        {...register("nombre")}
                                        className={`block w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-200 outline-none ${errors.nombre ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                                            }`}
                                        placeholder="Ej: Eventos S.A."
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        CUIT (11 dígitos)
                                    </label>
                                    <input
                                        type="text"
                                        {...register("cuit")}
                                        maxLength={11}
                                        className={`block w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-200 outline-none ${errors.cuit ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                                            }`}
                                        placeholder="30123456789"
                                    />
                                    {errors.cuit && <p className="text-red-500 text-xs mt-1">{errors.cuit.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Ubicación / Dirección
                                    </label>
                                    <input
                                        type="text"
                                        {...register("ubicacion")}
                                        className={`block w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-200 outline-none ${errors.ubicacion ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                                            }`}
                                        placeholder="Ej: Av. Pellegrini 1234, Rosario"
                                    />
                                    {errors.ubicacion && <p className="text-red-500 text-xs mt-1">{errors.ubicacion.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Email Administrativo
                                    </label>
                                    <input
                                        type="email"
                                        {...register("mail")}
                                        className={`block w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-200 outline-none ${errors.mail ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                                            }`}
                                        placeholder="admin@empresa.com"
                                    />
                                    {errors.mail && <p className="text-red-500 text-xs mt-1">{errors.mail.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        {...register("contraseña")}
                                        className={`block w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-200 outline-none ${errors.contraseña ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    {errors.contraseña && <p className="text-red-500 text-xs mt-1">{errors.contraseña.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Repetir Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        {...register("repetirContraseña")}
                                        className={`block w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-200 outline-none ${errors.repetirContraseña ? "border-red-500" : "border-gray-200 focus:border-purple-500"
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    {errors.repetirContraseña && <p className="text-red-500 text-xs mt-1">{errors.repetirContraseña.message}</p>}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:bg-gray-400 disabled:shadow-none"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Registrando...
                                        </span>
                                    ) : (
                                        "Registrar Organización"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/register"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Elegir otro tipo de cuenta
                    </Link>
                </div>
            </div>
        </div>
    );
}
