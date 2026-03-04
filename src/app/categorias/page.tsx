"use client";

import { useEffect, useState } from "react";
import { CategoriaForm } from "@/app/components/categoriaForm";
import { CategoriaTable } from "@/app/components/categoriaTable";
import RoleGuard from "@/app/components/RoleGuard";
import ConfirmDeleteModal from "@/app/components/ui/confirmDeleteModal";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "@/app/services/categoriaService";
import { Categoria, CategoriaFormData } from "@/types/categoria";

// New imports for client view
import { getEventos } from "@/app/services/eventosService";
import { getOrganizacionByUsuarioId } from "@/app/services/organizacionService";
import { Evento } from "@/types/evento";
import EventGrid from "@/app/components/eventGrid";
import { useAuth } from "@/context/AuthContext";

export default function CategoriasPage() {
  const { user } = useAuth();
  const rol = user?.rol;

  if (rol === "ADMIN") {
    return <AdminCategoriasView />;
  }
  return <ClienteCategoriasView />;
}

function AdminCategoriasView() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: CategoriaFormData) => {
    setLoading(true);
    try {
      if (editingCategoria) {
        await updateCategoria(editingCategoria.idCategoria, data);
      } else {
        await createCategoria(data);
      }
      await loadCategorias();
      setEditingCategoria(null);
    } catch (error: any) {
      if (error.isValidationError) {
        throw error;
      }
      console.error("Error al guardar la categoría:", error);
      alert((error as Error).message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
  };

  const handleDeleteRequest = (categoria: Categoria) => {
    setCategoriaToDelete(categoria);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoriaToDelete) return;
    setLoading(true);
    try {
      await deleteCategoria(categoriaToDelete.idCategoria);
      await loadCategorias();
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    } finally {
      setShowDeleteModal(false);
      setCategoriaToDelete(null);
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoria(null);
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <CategoriaForm
              initialData={editingCategoria || undefined}
              isEditing={!!editingCategoria}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
              loading={loading}
            />
          </div>
          <div className="col-span-12 md:col-span-8">
            <CategoriaTable
              categorias={categorias}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          </div>
        </div>

        {showDeleteModal && categoriaToDelete && (
          <ConfirmDeleteModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            itemName={categoriaToDelete.nombreCategoria}
          />
        )}
      </div>
    </RoleGuard>
  );
}

function ClienteCategoriasView() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, evts] = await Promise.all([getCategorias(), getEventos()]);
        let filtered = evts;
        if (user?.rol === "ORGANIZACION" && user?.idUsuario) {
          const org = await getOrganizacionByUsuarioId(Number(user.idUsuario));
          if (org) {
            filtered = evts.filter(e => e.idOrganizacion === org.idOrganizacion);
          }
        }
        setCategorias(cats);
        setEventos(filtered);
      } catch (e) {
        console.error("Error cargando datos de categorías/eventos:", e);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadData();
  }, [user]);

  return (
    <RoleGuard allowedRoles={["ORGANIZACION", "CLIENTE"]}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
          Eventos por Categoría
        </h1>
        <EventGrid eventos={eventos} loading={loading} />
      </div>
    </RoleGuard>
  );
}


