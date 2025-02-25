import React, { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { UserPlus } from "lucide-react";
import { ClienteFormData, DEFAULT_FORM_DATA } from "@/types/cliente";

const tiposDocumento = ["DNI", "Pasaporte", "Cédula"] as const;

interface ClienteFormProps {
  initialData?: ClienteFormData;
  isEditing?: boolean;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ClienteFormData>(
    initialData || DEFAULT_FORM_DATA
  );

  useEffect(() => {
    setFormData(initialData || DEFAULT_FORM_DATA);
  }, [initialData]);

  const handleInputChange = (field: keyof ClienteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData(DEFAULT_FORM_DATA);
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <Input
              required
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder="Nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <Input
              required
              value={formData.apellido}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
              placeholder="Apellido"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Documento</label>
            <select
              value={formData.tipoDoc}
              onChange={(e) => handleInputChange("tipoDoc", e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm"
            >
              {tiposDocumento.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Documento
            </label>
            <Input
              required
              value={formData.nroDoc}
              onChange={(e) => handleInputChange("nroDoc", e.target.value)}
              placeholder="Número de Documento"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Fecha de Nacimiento
            </label>
            <Input
              type="date"
              required
              value={formData.fechaNacimiento}
              onChange={(e) =>
                handleInputChange("fechaNacimiento", e.target.value)
              }
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <Input
              type="email"
              required
              value={formData.mail}
              onChange={(e) => handleInputChange("mail", e.target.value)}
              placeholder="Correo Electrónico"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <Input
              type="password"
              required={!isEditing}
              value={formData.contraseña}
              onChange={(e) => handleInputChange("contraseña", e.target.value)}
              placeholder="Contraseña"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {isEditing ? "Actualizar" : "Agregar"}
          </Button>
          {isEditing && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
