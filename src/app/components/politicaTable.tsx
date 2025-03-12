"use client"

import type React from "react"
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Loader2, Edit, Trash } from "lucide-react"
import type { Politica } from "@/types/politica"

interface PoliticaTableProps {
  politicas: Politica[]
  loading?: boolean
  onEdit: (politica: Politica) => void
  onDelete: (fechaVigencia: string) => void
}

export const PoliticaTable: React.FC<PoliticaTableProps> = ({ politicas, loading = false, onEdit, onDelete }) => {
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Fecha de Vigencia</th>
              <th className="px-4 py-2 text-left">Tiempo de Reembolso (días)</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center">
                  <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                </td>
              </tr>
            ) : politicas.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center">
                  No hay políticas registradas
                </td>
              </tr>
            ) : (
              politicas.map((politica) => (
                <tr key={politica.fechaVigencia} className="border-t">
                  <td className="px-4 py-2">{formatDate(politica.fechaVigencia)}</td>
                  <td className="px-4 py-2">{politica.tiempoReembolso} días</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Button onClick={() => onEdit(politica)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => onDelete(politica.fechaVigencia)} variant="destructive" size="sm">
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
  )
}

