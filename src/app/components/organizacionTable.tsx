import React from 'react';

import { Organizacion } from '@/types/organizacion';

interface OrganizacionTableProps {
    organizaciones: Organizacion[];
    loading: boolean;
    onEdit: (organizacion: Organizacion) => void;
    onDelete: (id: number) => void;
}

export const OrganizacionTable: React.FC<OrganizacionTableProps> = ({ 
    organizaciones,
    loading,
    onEdit,
    onDelete
     }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {organizaciones.map((organizacion) => (
                <tr key={organizacion.idOrganizacion} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {organizacion.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {organizacion.ubicacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {organizacion.usuario.mail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                    <button
                        onClick={() => onEdit(organizacion)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(organizacion.idOrganizacion)}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        Eliminar
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {loading && (
            <div className="p-4 text-center text-gray-500">
                Cargando...
            </div>
            )}
        </div>
    );
};
