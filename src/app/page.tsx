"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import EventGrid from "@/app/components/eventGrid";
import { getEventos } from "@/app/services/eventosService";
import { Evento } from "@/types/evento";
import { Rol } from "@/types/usuario";
import { Calendar, Ticket, User, Settings } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState<Rol | null>(null);

  useEffect(() => {
    const storedRol = localStorage.getItem("rol") as Rol | null;
    setRol(storedRol);
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      const data = await getEventos();
      setEventos(data);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">

      {/* Navbar */}
      <Navbar />

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
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Hoy</button>
            <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Este finde</button>
          </div>
        </div>

        <EventGrid eventos={eventos} loading={loading} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
