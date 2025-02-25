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
  const [loading, setLoading] = useState<boolean>(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    async function loadClientes() {
      setLoading(true);
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error loading clientes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadClientes();
  }, []);

  const handleFormSubmit = async (data: ClienteFormData) => {
    setLoading(true);
    try {
      if (editingCliente) {
        const updatedCliente = await updateCliente(
          editingCliente.idCliente,
          data
        );
        setClientes((prev) =>
          prev.map((cliente) =>
            cliente.idCliente === updatedCliente.idCliente
              ? updatedCliente
              : cliente
          )
        );
        setEditingCliente(null);
      } else {
        const newCliente = await createCliente(data);
        setClientes((prev) => [...prev, newCliente]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((cliente) => cliente.idCliente !== id));
    } catch (error) {
      console.error("Error deleting cliente:", error);
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
