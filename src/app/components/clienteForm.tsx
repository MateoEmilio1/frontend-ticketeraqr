import { useEffect } from "react";
import { ClienteFormData } from "@/types/cliente";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const clienteSchema = z.object({
  mail: z.string().email("Email inválido"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  tipoDoc: z.string().min(2, "Tipo de documento inválido"),
  nroDoc: z.string().min(7, "Número de documento inválido"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
});

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema) as any,
    defaultValues: initialData || {
      mail: "",
      contraseña: "",
      nombre: "",
      apellido: "",
      tipoDoc: "DNI",
      nroDoc: "",
      fechaNacimiento: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof ClienteFormData, value);
      });
    }
  }, [initialData, setValue]);

  const onFormSubmit = (data: ClienteFormData) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow"
    >
      <div>
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("mail")}
          disabled={isEditing}
          className={`w-full p-2 border rounded ${errors.mail ? 'border-red-500' : ''}`}
        />
        {errors.mail && <p className="text-red-500 text-xs mt-1">{errors.mail.message}</p>}
      </div>

      {!isEditing && (
        <div>
          <label className="block mb-2 text-sm font-medium">Contraseña</label>
          <input
            type="password"
            {...register("contraseña")}
            className={`w-full p-2 border rounded ${errors.contraseña ? 'border-red-500' : ''}`}
          />
          {errors.contraseña && <p className="text-red-500 text-xs mt-1">{errors.contraseña.message}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Nombre</label>
          <input
            type="text"
            {...register("nombre")}
            className={`w-full p-2 border rounded ${errors.nombre ? 'border-red-500' : ''}`}
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Apellido</label>
          <input
            type="text"
            {...register("apellido")}
            className={`w-full p-2 border rounded ${errors.apellido ? 'border-red-500' : ''}`}
          />
          {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Tipo Documento
          </label>
          <select
            {...register("tipoDoc")}
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
            {...register("nroDoc")}
            className={`w-full p-2 border rounded ${errors.nroDoc ? 'border-red-500' : ''}`}
          />
          {errors.nroDoc && <p className="text-red-500 text-xs mt-1">{errors.nroDoc.message}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Fecha Nacimiento
        </label>
        <input
          type="date"
          {...register("fechaNacimiento")}
          className={`w-full p-2 border rounded ${errors.fechaNacimiento ? 'border-red-500' : ''}`}
        />
        {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento.message}</p>}
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
