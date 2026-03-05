import { useEffect, useState } from "react";
import { Categoria } from "@/types/categoria";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categoriaSchema = z.object({
  idCategoria: z.number(),

  nombreCategoria: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(50, "El nombre no puede superar los 50 caracteres.")
    .refine((value) => value.length > 0, {
      message: "El nombre de la categoría es obligatorio.",
    }),
});

interface CategoriaFormProps {
  initialData?: Categoria;
  isEditing: boolean;
  onSubmit: (data: Categoria) => Promise<void> | void;
  onCancel?: () => void;
  loading: boolean;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [generalError, setGeneralError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Categoria>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: initialData || {
      idCategoria: 0,
      nombreCategoria: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("idCategoria", initialData.idCategoria);
      setValue("nombreCategoria", initialData.nombreCategoria);
    }
  }, [initialData, setValue]);

  const onFormSubmit = async (data: Categoria) => {
    try {
      setGeneralError("");
      await onSubmit(data);
    } catch (err: any) {

      if (err.isValidationError && err.details) {
        err.details.forEach((issue: { path: string; message: string }) => {
          if (issue.path === "nombreCategoria") {
            setError("nombreCategoria", {
              type: "backend",
              message: "Ya existe una categoría con ese nombre.",
            });
          }
        });
      } else {
        setGeneralError("Ocurrió un error inesperado. Intente nuevamente.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow w-full max-w-md"
    >

      {generalError && (
        <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
          {generalError}
        </div>
      )}

      <div>
        <label htmlFor="nombreCategoria" className="block mb-2 text-sm font-medium">
          Nombre de la Categoría
        </label>

        <input
          type="text"
          id="nombreCategoria"
          placeholder="Ej: Vacunas, Alimentos, Accesorios..."
          {...register("nombreCategoria")}
          className={`w-full p-2 border rounded outline-none transition 
          ${errors.nombreCategoria
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:ring-2 focus:ring-blue-200"
            }`}
        />

        {errors.nombreCategoria && (
          <p className="text-red-500 text-sm mt-1">
            {errors.nombreCategoria.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar Categoría" : "Crear Categoría"}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoriaForm;