import React from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Loader2, Edit, Trash } from "lucide-react";
import { Cliente } from "@/types/cliente";

interface ClienteTableProps {
  clientes: Cliente[];
  loading?: boolean;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

export const ClienteTable: React.FC<ClienteTableProps> = ({
  clientes,
  loading = false,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Documento</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  <Loader2 className="animate-spin h-5 w-5" />
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.idCliente} className="border-t">
                  <td className="px-4 py-2">
                    {cliente.nombre} {cliente.apellido}
                  </td>
                  <td className="px-4 py-2">
                    {cliente.tipoDoc} {cliente.nroDoc}
                  </td>
                  <td className="px-4 py-2">{cliente.mail}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onEdit(cliente)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onDelete(cliente.idCliente)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
