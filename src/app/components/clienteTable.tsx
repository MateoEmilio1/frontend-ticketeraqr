import { Cliente } from "@/types/cliente";

interface ClienteTableProps {
  clientes: Cliente[];
  loading: boolean;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

export const ClienteTable: React.FC<ClienteTableProps> = ({
  clientes,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Apellido
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Documento
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Nacimiento
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Teléfono
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <tr key={cliente.idCliente}>
              <td className="px-4 py-3">{cliente.nombre}</td>
              <td className="px-4 py-3">{cliente.apellido}</td>
              <td className="px-4 py-3">{cliente.usuario.mail}</td>
              <td className="px-4 py-3">
                {cliente.tipoDoc} {cliente.nroDoc}
              </td>
              <td className="px-4 py-3">
                {new Date(cliente.fechaNacimiento).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{cliente.telefono || "-"}</td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit(cliente)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(cliente.idCliente)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="p-4 text-center text-gray-500">Cargando...</div>
      )}
    </div>
  );
};
