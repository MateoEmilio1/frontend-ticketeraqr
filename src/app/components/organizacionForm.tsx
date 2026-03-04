"use client";

import React, { useEffect } from "react";
import { createOrganizacion } from "@/app/services/organizacionService";
import { OrganizacionFormData } from "@/types/organizacion";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const organizacionSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  ubicacion: z.string().min(5, "La ubicación debe ser más descriptiva"),
  cuit: z.string().regex(/^\d{11}$/, "CUIT debe tener 11 dígitos"),
  mail: z.string().email("Email inválido"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  repetirContraseña: z.string(),
}).superRefine((data, ctx) => {
  if (data.contraseña !== data.repetirContraseña) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Las contraseñas no coinciden",
      path: ["repetirContraseña"],
    });
  }
});

const OrganizacionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizacionFormData>({
    resolver: zodResolver(organizacionSchema) as unknown as Resolver<OrganizacionFormData>,
    defaultValues: {
      nombre: "",
      ubicacion: "",
      cuit: "",
      mail: "",
      contraseña: "",
      repetirContraseña: "",
    },
  });

  const [serverError, setServerError] = React.useState<string | null>(null);

  const onFormSubmit = async (data: OrganizacionFormData) => {
    setServerError(null);
    try {
      await createOrganizacion(data);
      alert("Organización creada con éxito");
      reset();
    } catch (err: unknown) {
      console.error("Error en createOrganizacion:", err);
      setServerError((err as Error)?.message || "Error al crear organización");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow"
    >
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          {...register("nombre")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>
      <div>
        <label
          htmlFor="cuit"
          className="block text-sm font-medium text-gray-700"
        >
          Cuit:
        </label>
        <input
          type="text"
          id="cuit"
          {...register("cuit")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.cuit ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.cuit && <p className="text-red-500 text-xs mt-1">{errors.cuit.message}</p>}
      </div>
      <div>
        <label
          htmlFor="ubicacion"
          className="block text-sm font-medium text-gray-700"
        >
          Ubicación:
        </label>
        <input
          type="text"
          id="ubicacion"
          {...register("ubicacion")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.ubicacion && <p className="text-red-500 text-xs mt-1">{errors.ubicacion.message}</p>}
      </div>
      <div>
        <label
          htmlFor="contraseña"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña:
        </label>
        <input
          type="password"
          id="contraseña"
          {...register("contraseña")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.contraseña ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.contraseña && <p className="text-red-500 text-xs mt-1">{errors.contraseña.message}</p>}
      </div>
      <div>
        <label
          htmlFor="mail"
          className="block text-sm font-medium text-gray-700"
        >
          Email:
        </label>
        <input
          type="email"
          id="mail"
          {...register("mail")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.mail ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.mail && <p className="text-red-500 text-xs mt-1">{errors.mail.message}</p>}
      </div>
      <div>
        <label
          htmlFor="repetirContraseña"
          className="block text-sm font-medium text-gray-700"
        >
          Repetir Contraseña:
        </label>
        <input
          type="password"
          id="repetirContraseña"
          {...register("repetirContraseña")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${errors.repetirContraseña ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.repetirContraseña && <p className="text-red-500 text-xs mt-1">{errors.repetirContraseña.message}</p>}
      </div>
      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Guardando..." : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default OrganizacionForm;