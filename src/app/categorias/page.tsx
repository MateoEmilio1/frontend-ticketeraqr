"use client";

import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { CategoriaForm } from "@/app/components/categoriaForm";
import { CategoriaTable } from "@/app/components/categoriaTable";
import {
  getCategorias,
  createCategoria,
  deleteCategoria,
} from "@/app/services/categoriaService";
import { CategoriaFormData, Categoria } from "@/types/categoria";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaFormData | null>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: CategoriaFormData) => {
    setLoading(true);
    try {
      if (editingCategoria && editingCategoria.idCategoria) {
        // No se implementó actualización, pero aquí iría la lógica para actualizar
      } else {
        const newCategoria = await createCategoria(data);
        setCategorias((prev) => [...prev, newCategoria]);
      }
      setEditingCategoria(null);
    } catch (error) {
      console.error("Error en el formulario:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    setLoading(true);
    try {
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((categoria) => categoria.idCategoria !== id));
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Tag className="h-6 w-6" /> Gestión de Categorías
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <CategoriaForm
            initialData={editingCategoria || undefined}
            isEditing={!!editingCategoria}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <CategoriaTable
            categorias={categorias}
            loading={loading}
            onEdit={(categoria) => setEditingCategoria(categoria)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
