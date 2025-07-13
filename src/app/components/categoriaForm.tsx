import { useState, useEffect } from "react";
import { Categoria } from "@/types/categoria";

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
  const [formData, setFormData] = useState<Categoria>({
    idCategoria: 0,
    nombreCategoria: "",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombreCategoria.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-lg shadow w-full max-w-md"
    >
      <div>
        <label htmlFor="nombreCategoria" className="block mb-2 text-sm font-medium">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          id="nombreCategoria"
          name="nombreCategoria"
          className="w-full p-2 border rounded"
          value={formData.nombreCategoria}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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