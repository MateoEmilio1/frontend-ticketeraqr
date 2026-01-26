import { useState, useEffect } from "react";
import { Politica, PoliticaFormData } from "@/types/politica";

interface PoliticaFormProps {
    politicaActual: Politica | null;
    onSubmit: (data: PoliticaFormData) => void;
    loading: boolean;
}

export const PoliticaForm: React.FC<PoliticaFormProps> = ({
    politicaActual,
    onSubmit,
    loading,
}) => {
    const [diasReembolso, setDiasReembolso] = useState<number | "">("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setDiasReembolso("");
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");


        if (diasReembolso === "" || diasReembolso <= 0) {
            setError("Debe ingresar un número de días válido (mayor a 0).");
            return;
        }

        if (!Number.isInteger(diasReembolso)) {
            setError("El número de días debe ser un valor entero.");
            return;
        }

        onSubmit({ diasReembolso: Number(diasReembolso) });
        setDiasReembolso("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setDiasReembolso("");
        } else {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                setDiasReembolso(numValue);
            }
        }
        setError("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-white rounded-lg shadow w-full max-w-md"
        >
            <h2 className="text-lg font-semibold mb-4">
                Crear Nueva Política
            </h2>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">
                    Política Actual de Reembolso
                </p>
                {politicaActual ? (
                    <div className="text-blue-700">
                        <p className="text-2xl font-bold">{politicaActual.diasReembolso} días</p>
                        <p className="text-xs mt-1">
                            Vigente desde:{" "}
                            {new Date(politicaActual.fechaVigencia).toLocaleDateString("es-AR")}
                        </p>
                    </div>
                ) : (
                    <p className="text-blue-600 italic">No hay política configurada</p>
                )}
            </div>

            <div>
                <label htmlFor="diasReembolso" className="block mb-2 text-sm font-medium">
                    Nueva Política de Reembolso (días)
                </label>
                <input
                    type="number"
                    id="diasReembolso"
                    name="diasReembolso"
                    className="w-full p-2 border rounded"
                    value={diasReembolso}
                    onChange={handleChange}
                    placeholder="Ingrese número de días"
                    min="1"
                    step="1"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Creando..." : "Crear nueva Política"}
                </button>
            </div>
        </form>
    );
};

export default PoliticaForm;
