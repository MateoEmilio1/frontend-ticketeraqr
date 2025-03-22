import { useState, useEffect } from "react";
import { EventoFormData } from "@/types/evento";

interface EventoFormProps {
  initialData?: EventoFormData;
  isEditing: boolean;
  onSubmit: (data: EventoFormData) => void;
  onCancel?: () => void;
  loading: boolean;
}

export const EventoForm: React.FC<EventoFormProps> = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<EventoFormData>({
    nombre: "",
    fechaCreacion: "",
    fechaHoraEvento: "",
    descripcion: "",
    foto: "",
    capacidadMax: 0,
    tipoTickets: [],
    idCategoria: 1,
    idOrganizacion: 1,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // In your EventoForm component, modify the handleChange function
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  if (
    name === "capacidadMax" ||
    name === "idCategoria" ||
    name === "idOrganizacion"
  ) {
    // Parse the value as an integer and handle invalid inputs
    const parsedValue = value;
    setFormData({ 
      ...formData, 
      [name]: parsedValue
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-lg shadow"
    >
      <div>
        <label className="block mb-2 text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Foto</label>
        <input
          type="text"
          name="foto"
          value={formData.foto}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Fecha y Hora del Evento
          </label>
          <input
            type="datetime-local"
            name="fechaHoraEvento"
            value={formData.fechaHoraEvento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
            Fecha de Creación
          </label>
          <input
            type="datetime-local"
            name="fechaCreacion"
            value={formData.fechaCreacion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Capacidad Máxima
          </label>
          <input
            type="number"
            name="capacidadMax"
            value={formData.capacidadMax}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min={1}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Categoría</label>
          <input
            type="number"
            name="idCategoria"
            value={formData.idCategoria}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Organización
          </label>
          <input
            type="number"
            name="idOrganizacion"
            value={formData.idOrganizacion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Sección para gestionar los tipoTickets podría agregarse aquí */}

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
