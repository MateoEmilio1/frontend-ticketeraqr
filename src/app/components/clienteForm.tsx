import { useState, useEffect } from "react";
import { ClienteFormData } from "@/types/cliente";

interface ClienteFormProps {
  initialData?: ClienteFormData;
  isEditing: boolean;
  onSubmit: (data: ClienteFormData) => void;
  onCancel?: () => void;
  loading: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<ClienteFormData>({
    mail: "",
    contraseña: "",
    nombre: "",
    apellido: "",
    tipoDoc: "DNI",
    nroDoc: "",
    fechaNacimiento: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
          disabled={isEditing}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {!isEditing && (
        <div>
          <label className="block mb-2 text-sm font-medium">Contraseña</label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required={!isEditing}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
          <label className="block mb-2 text-sm font-medium">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Tipo Documento
          </label>
          <select
            name="tipoDoc"
            value={formData.tipoDoc}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Cédula">Cédula</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Número Documento
          </label>
          <input
            type="text"
            name="nroDoc"
            value={formData.nroDoc}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Fecha Nacimiento
        </label>
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
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
