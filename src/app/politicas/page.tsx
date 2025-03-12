"use client"

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { PoliticaForm } from "@/app/components/politicaForm";
import { PoliticaTable } from "@/app/components/politicaTable";
import { getPoliticas, createPolitica, updatePolitica, deletePolitica } from "@/app/services/politicaService";
import type { PoliticaFormData, Politica } from "@/types/politica";

export default function PoliticasPage() {
  const [politicas, setPoliticas] = useState<Politica[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [editingPolitica, setEditingPolitica] = useState<Politica | null>(null)

  useEffect(() => {
    async function loadPoliticas() {
      setLoading(true)
      try {
        const data = await getPoliticas()
        setPoliticas(data)
      } catch (error) {
        console.error("Error loading politicas:", error)
      } finally {
        setLoading(false)
      }
    }
    loadPoliticas()
  }, [])

  const handleFormSubmit = async (data: PoliticaFormData) => {
    setLoading(true)
    try {
      if (editingPolitica) {
        // Para políticas, usamos fechaVigencia como identificador único
        const updatedPolitica = await updatePolitica(data)
        setPoliticas((prev) =>
          prev.map((politica) =>
            politica.fechaVigencia === updatedPolitica.fechaVigencia ? updatedPolitica : politica,
          ),
        )
        setEditingPolitica(null)
      } else {
        // Verificar si ya existe una política con la misma fecha
        const existingPolicy = politicas.find((p) => p.fechaVigencia === data.fechaVigencia)

        if (existingPolicy) {
          alert("Ya existe una política con esta fecha de vigencia")
          setLoading(false)
          return
        }

        const newPolitica = await createPolitica(data)
        setPoliticas((prev) => [...prev, newPolitica])
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (politica: Politica) => {
    setEditingPolitica(politica)
  }

  const handleDelete = async (fechaVigencia: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta política?")) {
      return
    }

    setLoading(true)
    try {
      await deletePolitica(fechaVigencia)
      setPoliticas((prev) => prev.filter((politica) => politica.fechaVigencia !== fechaVigencia))
    } catch (error) {
      console.error("Error deleting politica:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingPolitica(null)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FileText className="h-6 w-6" /> Gestión de Políticas de Reembolso
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <PoliticaForm
            initialData={editingPolitica || undefined}
            isEditing={!!editingPolitica}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <PoliticaTable politicas={politicas} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
}

