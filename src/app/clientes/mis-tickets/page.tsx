"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/types/tickets";
import { getTicketsByCliente } from "@/app/services/ticketService";
import { useRouter } from "next/navigation";
import { Calendar, Tag, QrCode, Ticket as TicketIcon, AlertCircle, CreditCard, Send, RefreshCcw } from "lucide-react";
import QrModal from "@/app/components/ui/QrModal";
import { useAuth } from "@/context/AuthContext";
import { transferTicket, refundTicket, acceptTransfer, rejectTransfer } from "@/app/services/ticketService";
import { getClienteByUsuarioId } from "@/app/services/clientService";

export default function MisTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [currentClienteId, setCurrentClienteId] = useState<number | null>(null);
    // const [loading, setLoading] = useState(true); // useAuth loading is better
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchTickets = async () => {
            // Wait for auth to be ready
            if (authLoading) return;

            if (!user || user.rol !== 'CLIENTE') {
                router.push("/");
                return;
            }

            try {
                const idUsuario = user.idUsuario;
                console.log('id Usuario: ', idUsuario);

                if (idUsuario) {
                    // Primero obtener el idCliente usando el idUsuario
                    const cliente = await getClienteByUsuarioId(Number(idUsuario));
                    if (cliente && cliente.idCliente) {
                        setCurrentClienteId(cliente.idCliente);
                        const data = await getTicketsByCliente(Number(cliente.idCliente));
                        setTickets(data);
                    } else {
                        setTickets([]);
                    }
                }
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar tus tickets.");
            } finally {
                setDataLoading(false);
            }
        };

        fetchTickets();
    }, [user, authLoading, router]);

    const fetchTickets = async () => {
        if (!user || user.idUsuario === undefined) return;
        try {
            const cliente = await getClienteByUsuarioId(Number(user.idUsuario));
            if (cliente && cliente.idCliente) {
                const data = await getTicketsByCliente(Number(cliente.idCliente));
                setTickets(data);
            }
        } catch (err) {
            console.error(err);
            setError("No se pudieron recargar tus tickets.");
        }
    };

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const handleOpenQr = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleCloseQr = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    const handleOpenTransfer = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsTransferModalOpen(true);
    };

    const handleOpenRefund = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsRefundModalOpen(true);
    };

    const handleTransfer = async () => {
        if (!selectedTicket || !recipientEmail) return;
        setActionLoading(true);
        try {
            await transferTicket(selectedTicket.nroTicket, recipientEmail);
            alert("Ticket transferido con éxito");
            setIsTransferModalOpen(false);
            setRecipientEmail("");
            fetchTickets();
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRefund = async () => {
        if (!selectedTicket) return;
        setActionLoading(true);
        try {
            await refundTicket(selectedTicket.nroTicket);
            alert("Reembolso procesado con éxito");
            setIsRefundModalOpen(false);
            fetchTickets();
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pagado":
                return "bg-green-100 text-green-800 border-green-200";
            case "consumido":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "expirado":
                return "bg-red-100 text-red-800 border-red-200";
            case "reembolsado":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "pendiente_transferencia":
                return "bg-purple-100 text-purple-800 border-purple-200";
            default:
                return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "pagado": return "Activo";
            case "consumido": return "Usado";
            case "expirado": return "Vencido";
            case "reembolsado": return "Reembolsado";
            case "pendiente_transferencia": return "Transfiriendo";
            default: return status;
        }
    };



    const handleAcceptTransfer = async (nroTicket: number) => {
        if (!window.confirm("¿Estás seguro que deseas recibir este ticket? Pasará a ser tuyo y el antiguo dueño ya no podrá usarlo.")) return;
        setActionLoading(true);
        try {
            await acceptTransfer(nroTicket);
            alert("Transferencia aceptada con éxito.");
            fetchTickets();
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectTransfer = async (nroTicket: number) => {
        if (!window.confirm("¿Estás seguro que deseas rechazar esta transferencia? El ticket volverá a ser propiedad del emisor original.")) return;
        setActionLoading(true);
        try {
            await rejectTransfer(nroTicket);
            alert("Transferencia rechazada.");
            fetchTickets();
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setActionLoading(false);
        }
    };

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
                                    ) : (ticket.estado === 'pendiente_transferencia' as string) ? (
                                        (ticket as Ticket & { ofertaTransferenciaIdCliente?: number }).ofertaTransferenciaIdCliente === currentClienteId ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptTransfer(ticket.nroTicket)}
                                                    disabled={actionLoading}
                                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                                                >
                                                    Aceptar
                                                </button>
                                                <button
                                                    onClick={() => handleRejectTransfer(ticket.nroTicket)}
                                                    disabled={actionLoading}
                                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-purple-600 font-medium italic">
                                                Aguardando aceptación
                                            </span>
                                        )
                                    ) : (
                                        <div className="flex gap-2">
                                            {ticket.estado === 'pagado' && (
                                                <>
                                                    <button
                                                        onClick={() => handleOpenTransfer(ticket)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Transferir Ticket"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenRefund(ticket)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Solicitar Reembolso"
                                                    >
                                                        <RefreshCcw className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {ticket.tokenQr && (
                                                <button
                                                    onClick={() => handleOpenQr(ticket)}
                                                    className="flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors ml-2"
                                                >
                                                    <QrCode className="w-4 h-4 mr-2" />
                                                    Ver QR
                                                </button>
                                            )}
                                        </div>
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

            {/* Modal Transferencia */}
            {isTransferModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Send className="w-6 h-6 text-indigo-600" />
                            ¿A quién querés transferir el ticket?
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Ingresa el correo electrónico del usuario al que deseas transferir esta entrada. Esta acción no se puede deshacer.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email del destinatario</label>
                                <input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setIsTransferModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleTransfer}
                                    disabled={actionLoading || !recipientEmail}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {actionLoading ? "Enviando..." : "Transferir"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reembolso */}
            {isRefundModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <RefreshCcw className="w-6 h-6 text-red-600" />
                            Solicitar Reembolso
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            ¿Estás seguro que deseas solicitar el reembolso de este ticket? Se validará la política de cancelación del evento.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsRefundModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRefund}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {actionLoading ? "Procesando..." : "Confirmar Reembolso"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
