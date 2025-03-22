"use client";

import React from "react";
import { Building2 } from "lucide-react";
import OrganizacionForm from "@/app/components/organizacionForm";
import OrganizacionTable from "@/app/components/organizacionTable";

export default function OrganizacionesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Building2 className="h-6 w-6" /> Organizaciones
      </h1>

      {/* Componente para crear nuevas organizaciones */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Crear Organización
        </h2>
        <OrganizacionForm />
      </div>

      {/* Componente para editar y eliminar organizaciones */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Listado de Organizaciones
        </h2>
        <OrganizacionTable />
      </div>
    </div>
  );
}
