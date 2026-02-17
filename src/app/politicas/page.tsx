"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, ArrowLeft } from "lucide-react";
import { PoliticaForm } from "@/app/components/PoliticaForm";
import RoleGuard from "@/app/components/RoleGuard";
import { PoliticaTable } from "@/app/components/PoliticaTable";
import {
    getPoliticaActual,
    getPoliticas,
    createPolitica,
    updatePolitica,
    deletePolitica,
} from "@/app/services/politicaService";
import { Politica, PoliticaFormData } from "@/types/politica";

export default function PoliticasPage() {
    const router = useRouter();
    const [politicas, setPoliticas] = useState<Politica[]>([]);
    const [politicaActual, setPoliticaActual] = useState<Politica | null>(null);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState<{
        tipo: "success" | "error";
        texto: string;
    } | null>(null);

    useEffect(() => {
        loadPoliticas();
    }, []);

    const loadPoliticas = async () => {
        try {
            const [actual, todas] = await Promise.all([
                getPoliticaActual(),
                getPoliticas(),
            ]);
            setPoliticaActual(actual);
            setPoliticas(todas);
        } catch (error) {
            console.error("Error cargando políticas:", error);
            setMensaje({
                tipo: "error",
                texto: "Error al cargar las políticas",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (data: PoliticaFormData) => {
        setLoading(true);
        setMensaje(null);
        try {
            const nuevaPolitica = await createPolitica(data);
            setPoliticas((prev) => [nuevaPolitica, ...prev]);
            setPoliticaActual(nuevaPolitica);
            setMensaje({
                tipo: "success",
                texto: `✓ Política creada exitosamente. Ahora el plazo de reembolso es de ${nuevaPolitica.diasReembolso} días.`,
            });
        } catch (error) {
            console.error("Error al procesar política:", error);
            setMensaje({
                tipo: "error",
                texto: `Error al crear la política.`,
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <RoleGuard allowedRoles={["ADMIN"]}>
            <div className="p-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-600" /> Establecer Políticas
                    </h1>
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Aceptar
                    </button>
                </div>

                {mensaje && (
                    <div
                        className={`mb-4 p-4 rounded-lg ${mensaje.tipo === "success"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                            }`}
                    >
                        {mensaje.texto}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                        <PoliticaForm
                            politicaActual={politicaActual}
                            onSubmit={handleFormSubmit}
                            loading={loading}
                        />
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <PoliticaTable
                            politicas={politicas}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
