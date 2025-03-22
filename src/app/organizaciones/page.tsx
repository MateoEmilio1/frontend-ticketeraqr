"use client"

import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import OrganizacionForm from "@/app/components/organizacionForm";
import { OrganizacionTable } from "@/app/components/organizacionTable";
import { getOrganizaciones, 
        createOrganizacion, 
        updateOrganizacion, 
        deleteOrganizacion } from "@/app/services/organizacionService";
import { OrganizacionFormData, Organizacion } from "@/types/organizacion";


export default function OrganizacionesPage() {
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrganizacion, setEditingOrganizacion] = useState<OrganizacionFormData | null>(
    null
  );

  useEffect(() => {
    loadOrganizaciones();
  }, []);

  const loadOrganizaciones = async () => {
    try {
      const data = await getOrganizaciones();
      setOrganizaciones(data);
    } catch (error) {
      console.error("Error cargando organizaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: OrganizacionFormData) => {
    setLoading(true);
    try {
      if (editingOrganizacion && editingOrganizacion.idOrganizacion) {
        const updatedOrganizacion = await updateOrganizacion(editingOrganizacion.idOrganizacion, {
          ...data
        });

        setOrganizaciones((prev) =>
          prev.map((organizacion) =>
            organizacion.idOrganizacion === updatedOrganizacion.idOrganizacion
              ? { ...updatedOrganizacion, usuario: organizacion.usuario }
              : organizacion
          )
        );
      } else {
        const newOrganizacion = await createOrganizacion(data);
        setOrganizaciones((prev) => [...prev, newOrganizacion]);
      }
      setEditingOrganizacion(null);
    } catch (error) {
      console.error("Error en el formulario:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (organizacion: Organizacion) => {
    setEditingOrganizacion({
      idOrganizacion: organizacion.idOrganizacion,
      nombre: organizacion.nombre,
      ubicacion: organizacion.ubicacion,
      mail: organizacion.usuario.mail,
      cuit: organizacion.cuit,
      contraseña: organizacion.usuario.contraseña
    });
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteOrganizacion(id);
      setOrganizaciones((prev) => prev.filter((organizacion) => organizacion.idOrganizacion !== id));
    } catch (error) {
      console.error("Error eliminando organizacion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => setEditingOrganizacion(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Building2 className="h-6 w-6"/>Organizaciones</h1>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de organizaciones</h2>
      </div>
      <div className="col-span-12 md:col-span-4">
        <OrganizacionForm
          initialData={editingOrganizacion || undefined}
          isEditing={!!editingOrganizacion}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
          loading={loading}
        />
      </div>
      
      <div className="col-span-12 md:col-span-8">
        <OrganizacionTable
          organizaciones={organizaciones}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}