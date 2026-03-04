"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { ClienteForm } from "@/app/components/clienteForm";
import { ClienteTable } from "@/app/components/clienteTable";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "@/app/services/clientService";
import { ClienteFormData, Cliente } from "@/types/cliente";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCliente, setEditingCliente] = useState<ClienteFormData | null>(
    null
  );

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: ClienteFormData) => {
    setLoading(true);
    try {
      if (editingCliente && editingCliente.idCliente) {
        const updatedCliente = await updateCliente(editingCliente.idCliente, {
          ...data,
          fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
        });

        setClientes((prev) =>
          prev.map((cliente) =>
            cliente.idCliente === updatedCliente.idCliente
              ? { ...updatedCliente, usuario: cliente.usuario }
              : cliente
          )
        );
      } else {
        const newCliente = await createCliente(data);
        setClientes((prev) => [...prev, newCliente]);
      }
      setEditingCliente(null);
    } catch (error: any) {
      if (error.isValidationError) {
        throw error;
      }
      console.error("Error en el formulario:", error);
      alert((error as Error).message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente({
      idCliente: cliente.idCliente,
      mail: cliente.usuario.mail,
      contraseña: "", // No mostramos la contraseña actual
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      tipoDoc: cliente.tipoDoc,
      nroDoc: cliente.nroDoc,
      fechaNacimiento: new Date(cliente.fechaNacimiento)
        .toISOString()
        .split("T")[0],
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    setLoading(true);
    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((cliente) => cliente.idCliente !== id));
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCliente(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Users className="h-6 w-6" /> Gestión de Clientes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <ClienteForm
            initialData={editingCliente || undefined}
            isEditing={!!editingCliente}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <ClienteTable
            clientes={clientes}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
