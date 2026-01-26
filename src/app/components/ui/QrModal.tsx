"use client";

import React from "react";
import QRCode from "react-qr-code";
import { X } from "lucide-react";

interface QrModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: {
        tokenQr: string;
        tipoTicket?: {
            evento?: {
                nombre: string;
            };
        };
    } | null;
}

export default function QrModal({ isOpen, onClose, ticket }: QrModalProps) {
    if (!isOpen || !ticket) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg truncate pr-4">
                        {ticket.tipoTicket?.evento?.nombre || "Ticket QR"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center">
                    <div className="bg-white p-2 rounded-xl shadow-inner border border-gray-100">
                        <QRCode
                            value={ticket.tokenQr}
                            size={200}
                            level="H"
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Muestra este código QR en la entrada del evento.
                    </p>

                    <div className="mt-2 text-xs font-mono bg-gray-100 px-3 py-1 rounded text-gray-600">
                        Token: {ticket.tokenQr.substring(0, 8)}...
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors shadow-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
