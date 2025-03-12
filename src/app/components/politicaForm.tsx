"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FileText } from "lucide-react"
import { type PoliticaFormData, DEFAULT_FORM_DATA } from "@/types/politica"

interface PoliticaFormProps {
  initialData?: PoliticaFormData
  isEditing?: boolean
  onSubmit: (data: PoliticaFormData) => Promise<void>
  onCancel?: () => void
  loading?: boolean
}

export const PoliticaForm: React.FC<PoliticaFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PoliticaFormData>(initialData || DEFAULT_FORM_DATA)

  useEffect(() => {
    setFormData(initialData || DEFAULT_FORM_DATA)
  }, [initialData])

  const handleInputChange = (field: keyof PoliticaFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
    if (!isEditing) {
      setFormData(DEFAULT_FORM_DATA)
    }
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        <h3 className="text-lg font-semibold">{isEditing ? "Editar Política" : "Nueva Política"}</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Vigencia</label>
            <Input
              type="date"
              required
              value={formData.fechaVigencia}
              onChange={(e) => handleInputChange("fechaVigencia", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tiempo de Reembolso (días)</label>
            <Input
              type="number"
              required
              min="0"
              value={formData.tiempoReembolso}
              onChange={(e) => handleInputChange("tiempoReembolso", Number.parseInt(e.target.value, 10) || 0)}
              placeholder="Tiempo de reembolso en días"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {isEditing ? "Actualizar" : "Agregar"}
          </Button>
          {isEditing && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

