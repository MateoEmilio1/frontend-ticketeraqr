import { useEffect, useState } from "react";
import { EventoFormData } from "@/types/evento";
import { Categoria } from "@/types/categoria";
import { getCategorias } from "@/app/services/categoriaService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const eventoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  foto: z.string().min(1, "La foto es requerida"),
  fechaHoraEvento: z.string().min(1, "La fecha del evento es requerida"),
  fechaCreacion: z.string().min(1, "La fecha de creación es requerida"),
  capacidadMax: z.preprocess((val) => Number(val), z.number().min(1, "La capacidad debe ser al menos 1")),
  idCategoria: z.preprocess((val) => Number(val), z.number().min(1, "Seleccione una categoría")),
  idOrganizacion: z.preprocess((val) => Number(val), z.number().min(1, "Seleccione una organización")),
  idEvento: z.number().optional(),
  tipoTickets: z.array(z.any()).default([]),
});

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
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema) as any,
    defaultValues: initialData || {
      nombre: "",
      fechaCreacion: new Date().toISOString().slice(0, 16),
      fechaHoraEvento: "",
      descripcion: "",
      foto: "",
      capacidadMax: 0,
      tipoTickets: [],
      idCategoria: 1,
      idOrganizacion: 1,
    },
  });

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof EventoFormData, value);
      });
    }
  }, [initialData, setValue]);

  const onFormSubmit = (data: EventoFormData) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow"
    >
      <div>
        <label className="block mb-2 text-sm font-medium">Nombre</label>
        <input
          type="text"
          {...register("nombre")}
          className={`w-full p-2 border rounded ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Descripción</label>
        <textarea
          {...register("descripcion")}
          className={`w-full p-2 border rounded ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
          rows={3}
        />
        {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Foto (URL)</label>
        <input
          type="text"
          {...register("foto")}
          className={`w-full p-2 border rounded ${errors.foto ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Fecha y Hora del Evento
          </label>
          <input
            type="datetime-local"
            {...register("fechaHoraEvento")}
            className={`w-full p-2 border rounded ${errors.fechaHoraEvento ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fechaHoraEvento && <p className="text-red-500 text-xs mt-1">{errors.fechaHoraEvento.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
            Fecha de Creación
          </label>
          <input
            type="datetime-local"
            {...register("fechaCreacion")}
            className={`w-full p-2 border rounded ${errors.fechaCreacion ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fechaCreacion && <p className="text-red-500 text-xs mt-1">{errors.fechaCreacion.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Capacidad Máxima
          </label>
          <input
            type="number"
            {...register("capacidadMax")}
            className={`w-full p-2 border rounded ${errors.capacidadMax ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.capacidadMax && <p className="text-red-500 text-xs mt-1">{errors.capacidadMax.message}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Categoría</label>
          <select
            {...register("idCategoria")}
            className={`w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block ${errors.idCategoria ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Seleccione...</option>
            {categorias.map(cat => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombreCategoria}
              </option>
            ))}
          </select>
          {errors.idCategoria && <p className="text-red-500 text-xs mt-1">{errors.idCategoria.message}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Organización (ID)
          </label>
          <input
            type="number"
            {...register("idOrganizacion")}
            className={`w-full p-2 border rounded ${errors.idOrganizacion ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.idOrganizacion && <p className="text-red-500 text-xs mt-1">{errors.idOrganizacion.message}</p>}
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
