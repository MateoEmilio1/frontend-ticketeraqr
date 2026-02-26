"use client";

import React, { useState, useEffect } from "react";
import {
  getOrganizaciones,
  updateOrganizacion,
  deleteOrganizacion,
} from "@/app/services/organizacionService";
import { Organizacion, OrganizacionFormData } from "@/types/organizacion";

const OrganizacionTable: React.FC = () => {
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<OrganizacionFormData>({
    nombre: "",
    ubicacion: "",
    cuit: "",
    mail: "",
    contraseña: "",
  });
  const [error, setError] = useState<string | null>(null);

  const loadOrganizaciones = async () => {
    setLoading(true);
    try {
      const data = await getOrganizaciones();
      setOrganizaciones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizaciones();
  }, []);

  const startEditing = (org: Organizacion) => {
    setEditingId(org.idOrganizacion);
    setEditData({
      nombre: org.nombre,
      ubicacion: org.ubicacion,
      cuit: org.cuit,
      mail: org.usuario.mail,
      // Para actualización, se requiere la contraseña; si no la quieres prellenar, déjala en blanco
      contraseña: "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (editingId === null) return;
    setLoading(true);
    try {
      const updated = await updateOrganizacion(
        editingId,
        editData
      );
      setOrganizaciones((prev) =>
        prev.map((org) =>
          org.idOrganizacion === updated.idOrganizacion
            ? { ...updated, usuario: org.usuario }
            : org
        )
      );
      setEditingId(null);
    } catch (err) {
      setError((err as Error).message);
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteOrganizacion(id);
      setOrganizaciones((prev) =>
        prev.filter((org) => org.idOrganizacion !== id)
      );
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Ubicación</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">CUIT</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {organizaciones.map((org) => (
              <tr key={org.idOrganizacion}>
                <td className="py-2 px-4 border">
                  {editingId === org.idOrganizacion ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editData.nombre}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    org.nombre
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editingId === org.idOrganizacion ? (
                    <input
                      type="text"
                      name="ubicacion"
                      value={editData.ubicacion}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    org.ubicacion
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editingId === org.idOrganizacion ? (
                    <input
                      type="email"
                      name="mail"
                      value={editData.mail}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    org.usuario.mail
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editingId === org.idOrganizacion ? (
                    <input
                      type="text"
                      name="cuit"
                      value={editData.cuit}
                      onChange={handleChange}
                      className="border p-1 w-full"
                    />
                  ) : (
                    org.cuit
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editingId === org.idOrganizacion ? (
                    <>
                      <button
                        onClick={saveChanges}
                        className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-2 py-1 bg-gray-300 text-black rounded"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(org)}
                        className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(org.idOrganizacion)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganizacionTable;