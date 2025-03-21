import { useState, useEffect } from "react";
import { CategoriaFormData } from "@/types/categoria";

interface CategoriaFormProps {
  initialData?: CategoriaFormData;
  isEditing: boolean;
  onSubmit: (data: CategoriaFormData) => void;
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
  const [formData, setFormData] = useState<CategoriaFormData>({
    nombreCategoria: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Limpiar error cuando el usuario escribe
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
      className="space-y-4 p-4 bg-white rounded-lg shadow"
    >
      <div>
        <label className="block mb-2 text-sm font-medium">Nombre Categoría</label>
        <input
          type="text"
          name="nombreCategoria"
          value={formData.nombreCategoria}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex gap-2 mt-4">
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
