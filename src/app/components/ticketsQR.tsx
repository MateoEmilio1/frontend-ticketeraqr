/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { obtenerQrPorTicket } from "../services/ticketService";
import { Ticket } from "@/types/tickets";

export default function TicketQr({ ticket, qr: initialQr }: { ticket: Ticket; qr?: string }) {
    const [qr, setQr] = useState<string | null>(initialQr || null);
    const [loading, setLoading] = useState(!initialQr);

    useEffect(() => {
        if (initialQr) {
            setQr(initialQr);
            setLoading(false);
            return;
        }

        const fetchQr = async () => {
            try {
                const res = await obtenerQrPorTicket(ticket.nroTicket);
                setQr(res.qr);
            } catch (error) {
                console.error("Error al obtener QR:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQr();
    }, [ticket, initialQr]);

    if (loading) return <p className="text-center text-gray-500">Generando QR...</p>;

    return (
        <div className="text-center mt-8">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">
                ✅ Ticket generado correctamente
            </h3>
            {qr ? (
                <div className="flex flex-col items-center space-y-3">
                    <img
                        src={qr}
                        alt="QR del ticket"
                        className="w-48 h-48 rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600 break-all">
                        Token: <span className="font-mono text-blue-700">{ticket.tokenQr}</span>
                    </p>
                    <p className="text-gray-700 font-semibold">
                        Estado: <span className="text-green-600">{ticket.estado}</span>
                    </p>
                </div>
            ) : (
                <p className="text-red-500">No se pudo generar el QR.</p>
            )}
        </div>
    );
}
