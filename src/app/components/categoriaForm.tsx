import { useEffect } from "react";
import { Categoria } from "@/types/categoria";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categoriaSchema = z.object({
  idCategoria: z.number(),
  nombreCategoria: z.string().min(3, "El nombre de la categoría debe tener al menos 3 caracteres"),
});

interface CategoriaFormProps {
  initialData?: Categoria;
  isEditing: boolean;
  onSubmit: (data: Categoria) => void;
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Categoria>({
    resolver: zodResolver(categoriaSchema) as any,
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

  const onFormSubmit = (data: Categoria) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow w-full max-w-md"
    >
      <div>
        <label htmlFor="nombreCategoria" className="block mb-2 text-sm font-medium">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          id="nombreCategoria"
          {...register("nombreCategoria")}
          className={`w-full p-2 border rounded ${errors.nombreCategoria ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.nombreCategoria && <p className="text-red-500 text-sm mt-1">{errors.nombreCategoria.message}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoriaForm;