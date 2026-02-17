import { useState, useEffect } from "react"; // Asegúrate de importar useState
import { TipoTicketFormData } from "@/types/evento"; // Asegúrate de importar el tipo correspondiente

interface TipoTicketFormProps {
  initialData?: TipoTicketFormData;  // Datos iniciales para editar un tipoTicket
  isEditing: boolean;                // Indica si estamos editando o creando un tipoTicket
  onSubmit: (data: TipoTicketFormData) => void;  // Enviar datos al componente principal
  onCancel?: () => void;             // Función para cancelar edición
  loading: boolean;                  // Indicador de carga
}

export const TipoTicketForm: React.FC<TipoTicketFormProps> = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<TipoTicketFormData>({
    tipo: "",
    acceso: "",
    sector: "",
    precio: 0,
    cantMaxPorTipo: 0,
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: name === "precio" || name === "cantMaxPorTipo" ? value.toString() : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Enviar el formulario
    setFormData({
      tipo: "",
      acceso: "",
      sector: "",
      precio: 0,
      cantMaxPorTipo: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block mb-2 text-sm font-medium">Tipo</label>
        <input
          type="text"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Acceso</label>
        <input
          type="text"
          name="acceso"
          value={formData.acceso}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Sector</label>
        <input
          type="text"
          name="sector"
          value={formData.sector || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Ej: Platea Alta B, Campo VIP"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Precio</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min={0}
          step="0.01"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Cantidad Máxima por Tipo</label>
        <input
          type="number"
          name="cantMaxPorTipo"
          value={formData.cantMaxPorTipo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min={0}
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
