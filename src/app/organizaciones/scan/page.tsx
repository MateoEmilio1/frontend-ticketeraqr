"use client";

import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { validarTicket, consumirTicket } from "@/app/services/ticketService";
import { Ticket } from "@/types/tickets";
import RoleGuard from "@/app/components/RoleGuard";


export default function QrScanPage() {
    const [mode, setMode] = useState<"verify" | "consume">("verify");
    const [data, setData] = useState<Ticket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [scanning, setScanning] = useState(true);
    const [loading, setLoading] = useState(false);

    // Reset state when switching modes
    useEffect(() => {
        resetState();
    }, [mode]);

    const resetState = () => {
        setData(null);
        setError(null);
        setSuccessMsg(null);
        setScanning(true);
        setLoading(false);
    };

    const handleScan = async (detectedCodes: { rawValue: string }[]) => {
        if (!scanning || detectedCodes.length === 0) return;

        const tokenQr = detectedCodes[0].rawValue;
        if (!tokenQr) return;

        setScanning(false);
        setLoading(true);
        setError(null);

        try {
            // First, always validate to show ticket info
            const initialValidation = await validarTicket(tokenQr);
            // Wait, validarTicket returns ticket object as 'data' field of response, 
            // but my service validates res.ok and returns data.data (the ticket object) directly.
            // Let's assume the service returns the Ticket object directly based on my edit.

            const ticketData = initialValidation;

            if (mode === "verify") {
                setData(ticketData);
                setSuccessMsg("Ticket verificado correctamente.");
            } else {
                // In consume mode, we show details and ask for confirmation
                setData(ticketData);
                // We don't set success message yet, waiting for confirmation
            }
        } catch (err: unknown) {
            setError((err as Error).message || "Error al procesar el código QR.");
            setScanning(false); // Stop scanning on error too, user can retry
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error: unknown) => {
        console.error(error);
    };

    const confirmConsumption = async () => {
        if (!data?.tokenQr) return;

        setLoading(true);
        try {
            await consumirTicket(data.tokenQr);
            setSuccessMsg("Ticket consumido con éxito.");
            // Update local state to reflect consumption if needed, or just show success
            setData({ ...data, estado: 'consumido', fechaConsumo: new Date() });
        } catch (err: unknown) {
            setError((err as Error).message || "Error al consumir el ticket.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard allowedRoles={["ORGANIZACION"]}>
            <div className="max-w-2xl mx-auto p-4 space-y-6">
                <h1 className="text-2xl font-bold text-center mb-6">Escáner de Tickets</h1>

                {/* Mode Selector */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => setMode("verify")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === "verify"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Verificar QR
                    </button>
                    <button
                        onClick={() => setMode("consume")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === "consume"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Consumir QR
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
                    {scanning ? (
                        <div className="relative aspect-square max-w-sm mx-auto bg-black">
                            <Scanner
                                onScan={handleScan}
                                onError={handleError}
                                components={{
                                    onOff: true,
                                    torch: true,
                                    zoom: true,
                                    finder: true,
                                }}
                                styles={{
                                    container: { width: '100%', height: '100%' }
                                }}
                            />
                            <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 p-2">
                                Apunte la cámara al código QR
                            </p>
                        </div>
                    ) : (
                        <div className="p-8 text-center space-y-4">
                            {loading && <p className="text-blue-500 animate-pulse">Procesando...</p>}

                            {!loading && error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                                    <p className="font-semibold">Error</p>
                                    <p>{error}</p>
                                </div>
                            )}

                            {!loading && !error && data && (
                                <div className="space-y-4 text-left">
                                    <div className={`p-3 rounded-lg text-center font-bold text-white ${data.estado === 'consumido' ? 'bg-orange-500' : 'bg-green-500'}`}>
                                        Estado: {data.estado.toUpperCase()}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-gray-500">Cliente:</span>
                                        <span className="font-medium text-right">{data.cliente?.nombre} {data.cliente?.apellido}</span>

                                        <span className="text-gray-500">Documento:</span>
                                        <span className="font-medium text-right">{data.cliente?.tipoDoc} {data.cliente?.nroDoc}</span>

                                        <span className="text-gray-500">Evento:</span>
                                        <span className="font-medium text-right">{data.tipoTicket?.evento?.nombre}</span>

                                        <span className="text-gray-500">Acceso:</span>
                                        <span className="font-medium text-right">{data.tipoTicket?.acceso}</span>

                                        {data.estado === 'consumido' && data.fechaConsumo && (
                                            <>
                                                <span className="text-gray-500">Consumido el:</span>
                                                <span className="font-medium text-right">
                                                    {new Date(data.fechaConsumo).toLocaleString()}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {mode === "consume" && !successMsg && (
                                        <div className="pt-4">
                                            <p className="text-center mb-4 text-gray-700">
                                                ¿Confirmar consumo del ticket?
                                            </p>
                                            <button
                                                onClick={confirmConsumption}
                                                className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
                                            >
                                                Confirmar Consumo
                                            </button>
                                        </div>
                                    )}

                                    {successMsg && (
                                        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 text-center">
                                            <p className="font-bold">{successMsg}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={resetState}
                                className="mt-6 px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                            >
                                {scanning ? "Cancelar" : "Escanear otro"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </RoleGuard>
    );
}
