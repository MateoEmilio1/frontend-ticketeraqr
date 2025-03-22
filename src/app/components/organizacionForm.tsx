"use client";

import React, { useState } from "react";
import { createOrganizacion } from "@/app/services/organizacionService";
import { OrganizacionFormData } from "@/types/organizacion";

const OrganizacionForm: React.FC = () => {
  const [formData, setFormData] = useState<OrganizacionFormData>({
    nombre: "",
    ubicacion: "",
    cuit: "",
    mail: "",
    contraseña: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createOrganizacion(formData);
      // Reinicia el formulario tras crear exitosamente
      setFormData({
        nombre: "",
        ubicacion: "",
        cuit: "",
        mail: "",
        contraseña: "",
      });
    } catch (err: any) {
      console.error("Error en createOrganizacion:", err);
      setError(err?.message || "Error al crear organización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
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
          name="cuit"
          value={formData.cuit}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
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
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
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
          name="contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
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
          name="mail"
          value={formData.mail}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default OrganizacionForm;
