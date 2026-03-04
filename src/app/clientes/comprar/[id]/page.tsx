/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Evento, TipoTicket } from "@/types/evento";
import { getEventoById } from "@/app/services/eventosService";
import { getClienteByUsuarioId } from "@/app/services/clientService";
import { crearTicket } from "@/app/services/ticketService";
import Footer from "@/app/components/footer";
import { Calendar, MapPin, Ticket as TicketIcon, CheckCircle, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import TicketQr from "../../../components/ticketsQR";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/app/components/ui/AuthModal";

export default function PurchasePage() {
    const { user, isAuthenticated } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTipo, setSelectedTipo] = useState<TipoTicket | null>(null);
    const [metodoPago, setMetodoPago] = useState<"tarjeta" | "mercadopago">("tarjeta");
    const [purchasing, setPurchasing] = useState(false);
    const [purchasedTicket, setPurchasedTicket] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Estado del formulario de tarjeta
    const [cardData, setCardData] = useState({
        numero: "",
        nombre: "",
        vencimiento: "",
        cvv: ""
    });

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getEventoById(Number(id));
            setEvento(data);
            if (data.tipoTickets.length > 0) {
                setSelectedTipo(data.tipoTickets[0]);
            }
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar la información del evento.");
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedTipo || !evento) return;

        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }

        // Validación simple de tarjeta - SOLO si el método de pago es tarjeta
        if (metodoPago === "tarjeta") {
            const numeroLimpio = cardData.numero.replace(/\s/g, ''); // Eliminar espacios
            if (!numeroLimpio || numeroLimpio.length < 16) {
                setError("Por favor ingresa un número de tarjeta válido (16 dígitos).");
                return;
            }
            if (!cardData.nombre) {
                setError("Por favor ingresa el nombre del titular.");
                return;
            }
            if (!cardData.vencimiento || !cardData.vencimiento.includes('/')) {
                setError("Por favor ingresa una fecha de vencimiento válida (MM/AA).");
                return;
            }

            // Validar vencimiento
            const [mes, anio] = cardData.vencimiento.split('/');
            const mesNum = parseInt(mes, 10);
            const anioNum = parseInt(`20${anio}`, 10);
            const fechaActual = new Date();
            const fechaVencimiento = new Date(anioNum, mesNum, 0); // Último día del mes de vencimiento

            if (isNaN(mesNum) || isNaN(anioNum) || mesNum < 1 || mesNum > 12) {
                setError("Fecha de vencimiento inválida.");
                return;
            }

            if (fechaVencimiento < fechaActual) {
                setError("Tu tarjeta está vencida.");
                return;
            }
            if (!cardData.cvv || cardData.cvv.length < 3) {
                setError("Por favor ingresa un CVV válido.");
                return;
            }
        }

        try {
            setPurchasing(true);
            setError(null);

            const idUsuario = user?.idUsuario || (user as { id?: number }).id;
            if (!idUsuario) {
                setIsAuthModalOpen(true);
                setPurchasing(false);
                return;
            }

            // Get the client ID for this user
            let cliente;
            try {
                cliente = await getClienteByUsuarioId(Number(idUsuario));
            } catch (err) {
                console.warn("Cliente no encontrado:", err);
                setError("Tu usuario no tiene un perfil de cliente asociado. Por favor contacta soporte.");
                setPurchasing(false);
                return;
            }

            const response = await crearTicket({
                idCliente: cliente.idCliente,
                idTipoTicket: selectedTipo.idTipoTicket,
                metodoPago: metodoPago
            });

            if (response.data.init_point) {
                // Redirigir a Mercado Pago
                window.location.href = response.data.init_point;
            } else {
                // Pago con tarjeta exitoso, redirigir a página de éxito
                router.push("/pago-exitoso");
            }
        } catch (err: unknown) {
            setError((err as Error).message || "Error al procesar la compra. Por favor, reintenta.");
        } finally {
            setPurchasing(false);
        }
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardData({
            ...cardData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Cargando detalles del evento...</p>
            </div>
        );
    }

    if (!evento) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-500 font-bold text-xl mb-4">Evento no encontrado</p>
                <Link href="/" className="text-blue-600 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                </Link>
            </div>
        );
    }

    if (purchasedTicket) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 uppercase">
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-green-100 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Compra exitosa!</h2>
                        <p className="text-gray-600 mb-8">Tu entrada para <span className="font-semibold">{evento.nombre}</span> ha sido generada.</p>

                        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                            <TicketQr ticket={purchasedTicket} qr={purchasedTicket.qr} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/clientes/mis-tickets"
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
                            >
                                Ver Mis Tickets
                            </Link>
                            <Link
                                href="/"
                                className="w-full text-gray-500 font-medium hover:text-gray-900 transition"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Event Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <img
                                src={evento.foto || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200"}
                                alt={evento.nombre}
                                className="w-full h-80 object-cover"
                            />
                            <div className="p-8">
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{evento.nombre}</h1>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <div className="p-3 bg-blue-100 rounded-xl">
                                            <Calendar className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">Fecha y Hora</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {new Date(evento.fechaHoraEvento).toLocaleDateString("es-AR", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                })}
                                            </p>
                                            <p className="text-gray-600">
                                                {new Date(evento.fechaHoraEvento).toLocaleTimeString("es-AR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })} hs
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                                        <div className="p-3 bg-purple-100 rounded-xl">
                                            <MapPin className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-purple-600 font-bold uppercase tracking-wider">Lugar</p>
                                            <p className="text-lg font-semibold text-gray-900">Ubicación del evento</p>
                                            <p className="text-gray-600">Confirma en tu ticket</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-blue max-w-none">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Sobre el evento</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {evento.descripcion || "No hay una descripción disponible para este evento. Pero seguro será una experiencia inolvidable."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Sidebar */}
                    <div className="lg:col-span-1">
                        {evento.estado === 'CANCELADO' ? (
                            <div className="bg-red-50 rounded-3xl shadow-xl border border-red-100 p-8 sticky top-8 text-center">
                                <h3 className="text-2xl font-bold text-red-700 mb-4">Evento Cancelado</h3>
                                <p className="text-red-600 font-medium">Este evento ha sido cancelado por la organización y la venta de entradas de este evento se ha cerrado. Se realizarán reembolsos automáticos.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <TicketIcon className="w-6 h-6 text-blue-600" />
                                    Seleccionar Entradas
                                </h3>

                                <div className="space-y-4 mb-8">
                                    {evento.tipoTickets.map((tipo) => (
                                        <button
                                            key={tipo.idTipoTicket}
                                            onClick={() => setSelectedTipo(tipo)}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${selectedTipo?.idTipoTicket === tipo.idTipoTicket
                                                ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-50"
                                                : "border-gray-100 hover:border-blue-200"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-900">{tipo.tipo}</span>
                                                <span className="text-xl font-extrabold text-blue-600">${tipo.precio}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <span>{tipo.acceso}</span>
                                                {tipo.sector && <span className="italic">Sector: {tipo.sector}</span>}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-4 mb-8 pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Método de Pago</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setMetodoPago("tarjeta")}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${metodoPago === "tarjeta" ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-50"
                                                }`}
                                        >
                                            <CreditCard className={`w-6 h-6 mb-2 ${metodoPago === "tarjeta" ? "text-blue-600" : "text-gray-400"}`} />
                                            <span className={`text-xs font-bold ${metodoPago === "tarjeta" ? "text-blue-600" : "text-gray-600"}`}>Tarjeta</span>
                                        </button>
                                        <button
                                            onClick={() => setMetodoPago("mercadopago")}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${metodoPago === "mercadopago" ? "border-sky-500 bg-sky-50" : "border-gray-100 hover:border-gray-50"
                                                }`}
                                        >
                                            <div className={`w-6 h-6 mb-2 flex items-center justify-center text-lg font-black ${metodoPago === "mercadopago" ? "text-sky-600" : "text-gray-400"}`}>M</div>
                                            <span className={`text-xs font-bold ${metodoPago === "mercadopago" ? "text-sky-600" : "text-gray-600"}`}>Mercado Pago</span>
                                        </button>
                                    </div>
                                </div>

                                {metodoPago === "tarjeta" && (
                                    <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase">Número de Tarjeta</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="numero"
                                                    placeholder="0000 0000 0000 0000"
                                                    value={cardData.numero}
                                                    onChange={handleCardChange}
                                                    maxLength={19}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono bg-white text-gray-900"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase">Titular</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                placeholder="Nombre como figura en la tarjeta"
                                                value={cardData.nombre}
                                                onChange={handleCardChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white text-gray-900"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase">Fecha Vto</label>
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                                            </div>
                                            <input
                                                type="text"
                                                name="vencimiento"
                                                placeholder="MM/AA"
                                                value={cardData.vencimiento}
                                                onChange={handleCardChange}
                                                maxLength={5}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-center bg-white text-gray-900"
                                            />
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase">CVV</label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    placeholder="123"
                                                    value={cardData.cvv}
                                                    onChange={handleCardChange}
                                                    maxLength={4}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-center bg-white text-gray-900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-6 flex items-start gap-2">
                                        <span className="font-bold">Error:</span> {error}
                                    </div>
                                )}

                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-600">Total</span>
                                        <span className="text-3xl font-black text-gray-900">${selectedTipo?.precio || 0}</span>
                                    </div>

                                    <button
                                        onClick={handlePurchase}
                                        disabled={purchasing || !selectedTipo}
                                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200 disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-3"
                                    >
                                        {purchasing ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-6 h-6" />
                                                Confirmar Compra
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-400">
                                        Al confirmar, aceptás nuestras políticas de reembolso y términos de servicio.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
