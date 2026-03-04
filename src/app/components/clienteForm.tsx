import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClienteFormData } from "@/types/cliente";
// La validación ahora se maneja enteramente en el backend.
// Las funciones onSubmit deben propagar los errores estructurados al formulario.

interface ClienteFormProps {
  initialData?: ClienteFormData;
  isEditing: boolean;
  onSubmit: (data: ClienteFormData) => Promise<void> | void;
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
    setError,
    formState: { errors },
  } = useForm<ClienteFormData>({
    defaultValues: initialData || {
      mail: "",
      contraseña: "",
      repetirContraseña: "",
      nombre: "",
      apellido: "",
      tipoDoc: "DNI",
      nroDoc: "",
      fechaNacimiento: "",
      prefijo: "+54",
      telefono: "",
    },
  });

  const [countryCode, setCountryCode] = useState("+54");

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key === "telefono" && value) {
          const match = value.match(/^(\+\d+)(.*)$/);
          if (match) {
            setCountryCode(match[1]);
            setValue("prefijo", match[1]);
            setValue("telefono", match[2]);
          } else {
            setValue("telefono", value);
          }
        } else {
          setValue(key as keyof ClienteFormData, value);
        }
      });
    }
  }, [initialData, setValue]);

  const onFormSubmit = async (data: ClienteFormData) => {
    const fullPhone = data.telefono ? `${data.prefijo || countryCode}${data.telefono}` : "";
    const { prefijo, ...submitData } = data;
    try {
      await onSubmit({ ...submitData, telefono: fullPhone });
    } catch (err: any) {
      if (err.isValidationError && err.details) {
        err.details.forEach((issue: { path: string, message: string }) => {
          let fieldName = issue.path;

          if (fieldName === "body.mail") fieldName = "mail";
          else if (fieldName === "body.contraseña") fieldName = "contraseña";
          else if (fieldName === "body.repetirContraseña") fieldName = "repetirContraseña";
          else if (fieldName === "body.nombre") fieldName = "nombre";
          else if (fieldName === "body.apellido") fieldName = "apellido";
          else if (fieldName === "body.tipoDoc") fieldName = "tipoDoc";
          else if (fieldName === "body.nroDoc") fieldName = "nroDoc";
          else if (fieldName === "body.fechaNacimiento") fieldName = "fechaNacimiento";
          else if (fieldName === "body.telefono") fieldName = "telefono";

          setError(fieldName as keyof ClienteFormData, {
            type: "backend",
            message: issue.message
          });
        });
      } else {
        throw err; // Propagate general errors up
      }
    }
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              {...register("contraseña")}
              className={`w-full p-2 border rounded ${errors.contraseña ? 'border-red-500' : ''}`}
            />
            {errors.contraseña && <p className="text-red-500 text-xs mt-1">{errors.contraseña.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Repetir Contraseña</label>
            <input
              type="password"
              {...register("repetirContraseña")}
              className={`w-full p-2 border rounded ${errors.repetirContraseña ? 'border-red-500' : ''}`}
            />
            {errors.repetirContraseña && <p className="text-red-500 text-xs mt-1">{errors.repetirContraseña.message}</p>}
          </div>
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

      <div>
        <label className="block mb-2 text-sm font-medium">Teléfono</label>
        <div className="flex gap-2">
          <select
            {...register("prefijo")}
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-24 p-2 border rounded bg-gray-50"
          >
            <option value="+54">+54 (AR)</option>
            <option value="+598">+598 (UY)</option>
            <option value="+56">+56 (CL)</option>
            <option value="+55">+55 (BR)</option>
            <option value="+595">+595 (PY)</option>
            <option value="+51">+51 (PE)</option>
            <option value="+1">+1 (US/CA)</option>
            <option value="+34">+34 (ES)</option>
          </select>
          <input
            type="tel"
            {...register("telefono")}
            className={`flex-1 p-2 border rounded ${errors.telefono ? 'border-red-500' : ''}`}
            placeholder="Ej: 1122334455"
          />
        </div>
        {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
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
