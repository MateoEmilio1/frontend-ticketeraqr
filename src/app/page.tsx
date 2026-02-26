"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/app/components/footer";
import EventGrid from "@/app/components/eventGrid";
import { getEventos } from "@/app/services/eventosService";
import { getCategorias } from "@/app/services/categoriaService";
import { Evento } from "@/types/evento";
import { Categoria } from "@/types/categoria";
import { Calendar, Ticket, User, Settings, Filter } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const rol = user?.rol;

  const loadData = async () => {
    try {
      const [eventosData, categoriasData] = await Promise.all([
        getEventos(),
        getCategorias()
      ]);
      setEventos(eventosData);
      setFilteredEventos(eventosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategoria === "all") {
      setFilteredEventos(eventos);
    } else {
      setFilteredEventos(eventos.filter(e => e.idCategoria === parseInt(selectedCategoria)));
    }
  }, [selectedCategoria, eventos]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Hero Section */}
      <header className="bg-white border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-6">
              Descubrí los mejores <span className="text-blue-600">Eventos</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Gestioná tus entradas de manera rápida y segura. Todo en un solo lugar con nuestra tecnología de tickets QR.
            </p>

            {rol === "CLIENTE" && (
              <div className="flex justify-center gap-4">
                <Link
                  href="/clientes/mis-tickets"
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  <Ticket className="w-5 h-5" />
                  Ver Mis Tickets
                </Link>
                <Link
                  href="#proximos-eventos"
                  className="flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                >
                  <Calendar className="w-5 h-5" />
                  Explorar Eventos
                </Link>
              </div>
            )}

            {rol === "ORGANIZACION" && (
              <div className="flex justify-center gap-4">
                <Link
                  href="/eventos"
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  <Settings className="w-5 h-5" />
                  Gestionar Mis Eventos
                </Link>
              </div>
            )}

            {rol === "ADMIN" && (
              <div className="flex justify-center gap-4">
                <Link
                  href="/admin/politicas"
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  <Settings className="w-5 h-5" />
                  Panel de Administración
                </Link>
              </div>
            )}

            {!rol && (
              <div className="flex justify-center gap-4">
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  <User className="w-5 h-5" />
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="proximos-eventos" className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Próximos Eventos</h2>
            <p className="text-gray-500">Explorá nuestra selección de eventos exclusivos</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                title="Filtrar por categoría"
                className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none pr-4"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-200 transition-all shadow-sm">Hoy</button>
              <button className="px-4 py-2 bg-white border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-200 transition-all shadow-sm">Este finde</button>
            </div>
          </div>
        </div>

        <EventGrid eventos={filteredEventos} loading={loading} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
