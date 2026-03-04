import { useEffect } from "react";
import { Politica, PoliticaFormData } from "@/types/politica";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const politicaSchema = z.object({
    diasReembolso: z.coerce
        .number()
        .int("Debe ser un número entero")
        .min(1, "Debe ingresar al menos 1 día"),
    fechaVigencia: z.string().min(1, "Debe ingresar una fecha de vigencia"),
});

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
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, dirtyFields },
    } = useForm<PoliticaFormData>({
        resolver: zodResolver(politicaSchema) as unknown as Resolver<PoliticaFormData>,
        defaultValues: {
            fechaVigencia: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16),
        },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (!dirtyFields.fechaVigencia) {
                setValue(
                    "fechaVigencia",
                    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                );
            }
        }, 10000); // Actualiza la hora cada 10 segundos mientras no se edite el campo manualmente

        return () => clearInterval(interval);
    }, [dirtyFields.fechaVigencia, setValue]);

    const onFormSubmit = (data: PoliticaFormData) => {
        onSubmit(data);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-4 p-4 bg-white rounded-lg shadow w-full max-w-md"
        >
            <h2 className="text-lg font-semibold mb-4">Crear Nueva Política</h2>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">
                    Política Actual de Reembolso
                </p>
                {politicaActual ? (
                    <div className="text-blue-700">
                        <p className="text-2xl font-bold">
                            {politicaActual.diasReembolso} días
                        </p>
                        <p className="text-xs mt-1">
                            Vigente desde:{" "}
                            {new Date(politicaActual.fechaVigencia).toLocaleString("es-AR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                ) : (
                    <p className="text-blue-600 italic">No hay política configurada</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="diasReembolso"
                    className="block mb-2 text-sm font-medium"
                >
                    Nueva Política de Reembolso (días)
                </label>
                <input
                    type="number"
                    id="diasReembolso"
                    {...register("diasReembolso")}
                    className={`w-full p-2 border rounded ${errors.diasReembolso ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="Ingrese número de días"
                />
                {errors.diasReembolso && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.diasReembolso.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="fechaVigencia"
                    className="block mb-2 text-sm font-medium"
                >
                    Fecha de Entrada en Vigencia
                </label>
                <input
                    type="datetime-local"
                    id="fechaVigencia"
                    {...register("fechaVigencia")}
                    className={`w-full p-2 border rounded ${errors.fechaVigencia ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.fechaVigencia && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.fechaVigencia.message}
                    </p>
                )}
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
