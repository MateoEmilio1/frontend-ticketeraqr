"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { forgotPassword } from "../services/usuarioService";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const response = await forgotPassword(email);
            setMessage({ text: response.message, type: "success" });
        } catch (error) {
            setMessage({ text: (error as Error).message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <Link href="/login" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Login
                    </Link>

                    <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">Recuperar Acceso</h1>
                    <p className="text-gray-500 mb-8 font-medium">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tu Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold"
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-indigo-100"
                        >
                            {loading ? "Enviando..." : <><Send className="h-5 w-5" /> Enviar Enlace</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
