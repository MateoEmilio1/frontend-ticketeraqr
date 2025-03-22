import React, { useState } from 'react';
import { OrganizacionFormData } from '../../types/organizacion';

interface OrganizacionFormProps {
    onSubmit: (data: OrganizacionFormData) => void;
    initialData?: OrganizacionFormData;
    loading: boolean;
    onCancel?: () => void;
    isEditing: boolean;
}

const OrganizacionForm: React.FC<OrganizacionFormProps> = ({ 
    onSubmit, 
    initialData,
    loading,
    onCancel,
    isEditing
    }) => {
    const [formData, setFormData] = useState<OrganizacionFormData>(
        initialData || {
            nombre: '',
            ubicacion: '',
            cuit: '',
            mail: '',
            contraseña: '',
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre:
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="cuit" className="block text-sm font-medium text-gray-700">
                        Cuit:
                    </label>
                    <input
                        type="text"
                        id="cuit"
                        name="cuit"
                        value={formData.cuit}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">
                        Ubicacion:
                    </label>
                    <input
                        type="text"
                        id="ubicacion"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
                        Contraseña:
                    </label>
                    <input
                        type="password"
                        id="contraseña"
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="mail" className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="mail"
                        name="mail"
                        value={formData.mail}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            <div className="flex gap-2 mt-4">
            <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>

            {isEditing && (
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

export default OrganizacionForm;