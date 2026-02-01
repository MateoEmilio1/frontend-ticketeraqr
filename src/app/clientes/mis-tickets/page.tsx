"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/types/tickets";
import { getTicketsByCliente } from "@/app/services/ticketService";
import { useRouter } from "next/navigation";
import { Calendar, Tag, QrCode, Ticket as TicketIcon, AlertCircle, CreditCard } from "lucide-react";
import QrModal from "@/app/components/ui/QrModal";

export default function MisTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const idUsuario = localStorage.getItem("idUsuario");
                if (!idUsuario) {
                    router.push("/login");
                    return;
                }

                // 1. Obtener el cliente asociado al usuario
                const { getClienteByUsuarioId } = await import("@/app/services/clientService");
                const clientData = await getClienteByUsuarioId(Number(idUsuario));

                // 2. Obtener los tickets usando el idCliente correcto
                if (clientData && clientData.idCliente) {
                    const data = await getTicketsByCliente(clientData.idCliente);
                    setTickets(data);
                }
            } catch (err) {
                console.error(err);
                // Si falla porque no tiene cliente, es normal mostrar lista vacía o error específico
                setError("No se pudieron cargar tus tickets.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [router]);

    const handleOpenQr = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleCloseQr = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    const getStatusColor = (status: Ticket["estado"]) => {
        switch (status) {
            case "pagado":
                return "bg-green-100 text-green-800 border-green-200";
            case "consumido":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "expirado":
                return "bg-red-100 text-red-800 border-red-200";
            case "reembolsado":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    const getStatusLabel = (status: Ticket["estado"]) => {
        switch (status) {
            case "pagado": return "Activo";
            case "consumido": return "Usado";
            case "expirado": return "Vencido";
            case "reembolsado": return "Reembolsado";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <TicketIcon className="w-8 h-8 text-indigo-600" />
                            Mis Tickets
                        </h1>
                        <p className="mt-2 text-gray-600">Gestina y visualiza tus entradas a eventos</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                )}

                {tickets.length === 0 && !error ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TicketIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tienes tickets aún</h3>
                        <p className="text-gray-500 mt-2">¡Explora los eventos disponibles y consigue tu primera entrada!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.nroTicket}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="p-6">
                                    {/* Header with Status and ID */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(ticket.estado)}`}>
                                            {getStatusLabel(ticket.estado)}
                                        </span>
                                        <span className="text-xs font-mono text-gray-400">#{ticket.nroTicket}</span>
                                    </div>

                                    {/* Event Info */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {ticket.tipoTicket?.evento?.nombre || "Evento sin nombre"}
                                    </h3>

                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                                            <span className="text-sm">
                                                {ticket.tipoTicket?.evento?.fechaHoraEvento
                                                    ? new Date(ticket.tipoTicket.evento.fechaHoraEvento).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : "Fecha por confirmar"}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <Tag className="w-4 h-4 mr-3 text-gray-400" />
                                            <span className="text-sm">Acceso: {ticket.tipoTicket?.acceso || "General"} {ticket.tipoTicket?.sector && `- Sector: ${ticket.tipoTicket.sector}`}</span>
                                        </div>

                                        {ticket.metodoPago && (
                                            <div className="flex items-center text-gray-600">
                                                <CreditCard className="w-4 h-4 mr-3 text-gray-400" />
                                                <span className="text-sm font-medium capitalize">Pago: {ticket.metodoPago}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer / Action */}
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="text-sm font-semibold text-gray-900">
                                        ${ticket.tipoTicket?.precio || 0}
                                    </div>
                                    {ticket.estado === 'pendiente' ? (
                                        <span className="text-xs text-orange-600 font-medium italic">
                                            Podrás ver el QR cuando finalices el pago
                                        </span>
                                    ) : (
                                        ticket.tokenQr && (
                                            <button
                                                onClick={() => handleOpenQr(ticket)}
                                                className="flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                                            >
                                                <QrCode className="w-4 h-4 mr-2" />
                                                Ver QR
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <QrModal
                isOpen={isModalOpen}
                onClose={handleCloseQr}
                ticket={selectedTicket}
            />
        </div>
    );
}
