import React from "react";
import { Calendar, MapPin, Tag, ArrowRight } from "lucide-react";
import { Evento } from "@/types/evento";
import Link from "next/link";

interface EventGridProps {
    eventos: Evento[];
    loading: boolean;
}

export const EventGrid: React.FC<EventGridProps> = ({ eventos, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-96"></div>
                ))}
            </div>
        );
    }

    if (eventos.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No hay eventos disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento) => (
                <div
                    key={evento.idEvento}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={evento.foto || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800"}
                            alt={evento.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                Próximamente
                            </span>
                        </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {evento.nombre}
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-gray-600 text-sm">
                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                {new Date(evento.fechaHoraEvento).toLocaleDateString("es-AR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                Online / Presencial
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <Tag className="w-4 h-4 mr-2 text-blue-500" />
                                {evento.tipoTickets.length} tipos de entradas
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div>
                                    <p className="text-xs text-gray-500">Desde</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ${Math.min(...evento.tipoTickets.map(t => t.precio))}
                                    </p>
                                </div>
                                <Link
                                    href={`/comprar/${evento.idEvento}`}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-95 duration-200"
                                >
                                    Comprar
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventGrid;
