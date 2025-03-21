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

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block mb-2 text-sm font-medium">Nombre de la Categoría</label>
        <input
          type="text"
          name="nombreCategoria"
          value={formData.nombreCategoria}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </button>

        {isEditing && (
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

interface CategoriaTableProps {
  categorias: Categoria[];
  loading: boolean;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export const CategoriaTable: React.FC<CategoriaTableProps> = ({
  categorias,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Nombre de Categoría</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {categorias.map((categoria) => (
            <tr key={categoria.idCategoria}>
              <td className="px-4 py-3">{categoria.idCategoria}</td>
              <td className="px-4 py-3">{categoria.nombreCategoria}</td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(categoria)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(categoria.idCategoria)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="p-4 text-center text-gray-500">Cargando...</div>
      )}
    </div>
  );
};
