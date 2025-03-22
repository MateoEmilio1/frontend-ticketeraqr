"use client";

import React, { useState, useEffect } from "react";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "@/app/services/categoriaService";
import { Categoria, CategoriaFormData } from "@/types/categoria";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";

const CategoriasPage = () => {
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
    null
  );

  // Función para obtener la lista de categorías
  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Maneja el envío del formulario para crear o actualizar categoría
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: CategoriaFormData = { nombreCategoria };
    try {
      if (editingCategoria) {
        await updateCategoria(editingCategoria.idCategoria, formData);
        setEditingCategoria(null);
      } else {
        await createCategoria(formData);
      }
      setNombreCategoria("");
      fetchCategorias();
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };

  // Configura el formulario para editar una categoría
  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setNombreCategoria(categoria.nombreCategoria);
  };

  // Elimina una categoría
  const handleDelete = async (id: number) => {
    try {
      await deleteCategoria(id);
      fetchCategorias();
    } catch (error) {
      console.error("Error al eliminar la categoría", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Formulario para crear o editar */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingCategoria ? "Editar Categoría" : "Crear Categoría"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombreCategoria" className="block mb-1">
                Nombre de la Categoría
              </Label>
              <Input
                id="nombreCategoria"
                type="text"
                placeholder="Ingrese el nombre de la categoría"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button type="submit">
                {editingCategoria ? "Actualizar" : "Crear"}
              </Button>
              {editingCategoria && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setEditingCategoria(null);
                    setNombreCategoria("");
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          {categorias.length === 0 ? (
            <p className="text-muted-foreground">
              No hay categorías disponibles.
            </p>
          ) : (
            <div className="divide-y">
              {categorias.map((categoria) => (
                <div
                  key={categoria.idCategoria}
                  className="py-2 flex justify-between items-center"
                >
                  <span>{categoria.nombreCategoria}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(categoria)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(categoria.idCategoria)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriasPage;
