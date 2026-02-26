"use client";

import { useState, useEffect } from "react";
import { User, Lock, Mail, Save, MapPin, Building2, CreditCard } from "lucide-react";
import Navbar from "@/app/components/navbar";
import { updateCliente, getClienteByUsuarioId } from "@/app/services/clientService";
import { updateOrganizacion, getOrganizacionByUsuarioId } from "@/app/services/organizacionService";
import { ClienteFormData } from "@/types/cliente";
import { OrganizacionFormData } from "@/types/organizacion";

type ProfileData = (ClienteFormData & { rol: "CLIENTE" }) | (OrganizacionFormData & { rol: "ORGANIZACION" });

export default function PerfilPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userId = localStorage.getItem("idUsuario");
                const userRole = localStorage.getItem("rol");
                if (!userId || !userRole) throw new Error("No hay sesión activa");

                if (userRole === "CLIENTE") {
                    const clientData = await getClienteByUsuarioId(parseInt(userId));

                    let prefijo = "+54";
                    let tel = clientData.telefono || "";
                    if (tel.startsWith("+")) {
                        const match = tel.match(/^(\+\d+)(.*)$/);
                        if (match) {
                            prefijo = match[1];
                            tel = match[2];
                        }
                    }

                    setProfile({
                        rol: "CLIENTE",
                        idCliente: clientData.idCliente,
                        nombre: clientData.nombre,
                        apellido: clientData.apellido,
                        mail: clientData.usuario.mail,
                        tipoDoc: clientData.tipoDoc,
                        nroDoc: clientData.nroDoc,
                        fechaNacimiento: new Date(clientData.fechaNacimiento).toISOString().split('T')[0],
                        telefono: tel,
                        prefijo: prefijo,
                        contraseña: ""
                    } as any);
                } else if (userRole === "ORGANIZACION") {
                    const orgData = await getOrganizacionByUsuarioId(parseInt(userId));
                    setProfile({
                        rol: "ORGANIZACION",
                        idOrganizacion: orgData.idOrganizacion,
                        nombre: orgData.nombre,
                        ubicacion: orgData.ubicacion,
                        cuit: orgData.cuit,
                        mail: orgData.usuario.mail,
                        contraseña: ""
                    });
                }
            } catch (error) {
                console.error("Error cargando perfil:", error);
                setMessage({ text: "Error al cargar el perfil", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            if (profile.rol === "CLIENTE" && profile.idCliente) {
                const fullPhone = profile.telefono ? `${(profile as any).prefijo || "+54"}${profile.telefono}` : "";
                await updateCliente(profile.idCliente, { ...profile, telefono: fullPhone });
            } else if (profile.rol === "ORGANIZACION" && profile.idOrganizacion) {
                await updateOrganizacion(profile.idOrganizacion, profile);
            }

            setMessage({ text: "Perfil actualizado con éxito", type: "success" });
            setProfile(prev => prev ? { ...prev, contraseña: "" } : null);
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            setMessage({ text: (error as Error).message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10 text-xl font-semibold">Cargando perfil...</div>;

    return (
        <div className="min-h-screen bg-gray-50 uppercase">
            <Navbar />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-indigo-600 px-8 py-10 text-white">
                        <h1 className="text-3xl font-extrabold flex items-center gap-3">
                            <User className="h-8 w-8" /> Mi Perfil
                        </h1>
                        <p className="mt-2 text-indigo-100 italic">Actualiza tu información {profile?.rol === 'ORGANIZACION' ? 'de la organización' : 'personal'} y contraseña</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {message.text && (
                            <div className={`p-4 rounded-lg font-medium text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Building2 className="h-4 w-4" /> {profile?.rol === 'ORGANIZACION' ? 'Nombre de Organización' : 'Nombre'}
                                </label>
                                <input
                                    type="text"
                                    value={profile?.nombre || ""}
                                    onChange={e => setProfile(prev => ({ ...prev!, nombre: e.target.value } as any))}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                    required
                                />
                            </div>

                            {profile?.rol === 'CLIENTE' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Apellido</label>
                                    <input
                                        type="text"
                                        value={profile.apellido}
                                        onChange={e => setProfile(prev => ({ ...prev!, apellido: e.target.value } as any))}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                        required
                                    />
                                </div>
                            )}

                            {profile?.rol === 'ORGANIZACION' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Ubicación
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.ubicacion}
                                        onChange={e => setProfile(prev => ({ ...prev!, ubicacion: e.target.value } as any))}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={profile?.mail || ""}
                                    onChange={e => setProfile(prev => ({ ...prev!, mail: e.target.value } as any))}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                    required
                                />
                            </div>

                            {profile?.rol === 'CLIENTE' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            value={profile.fechaNacimiento}
                                            onChange={e => setProfile(prev => ({ ...prev!, fechaNacimiento: e.target.value } as any))}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tipo de Documento</label>
                                        <input
                                            type="text"
                                            value={profile.tipoDoc}
                                            onChange={e => setProfile(prev => ({ ...prev!, tipoDoc: e.target.value } as any))}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nro de Documento</label>
                                        <input
                                            type="text"
                                            value={profile.nroDoc}
                                            onChange={e => setProfile(prev => ({ ...prev!, nroDoc: e.target.value } as any))}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Teléfono</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={(profile as any).prefijo || "+54"}
                                                onChange={e => setProfile(prev => ({ ...prev!, prefijo: e.target.value } as any))}
                                                className="w-28 px-2 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none bg-white"
                                            >
                                                <option value="+54">+54 (AR)</option>
                                                <option value="+598">+598 (UY)</option>
                                                <option value="+56">+56 (CL)</option>
                                                <option value="+55">+55 (BR)</option>
                                                <option value="+595">+595 (PY)</option>
                                                <option value="+51">+51 (PE)</option>
                                                <option value="+1">+1 (US/CA)</option>
                                                <option value="+34">+34 (ES)</option>
                                            </select>
                                            <input
                                                type="tel"
                                                value={profile.telefono || ""}
                                                onChange={e => setProfile(prev => ({ ...prev!, telefono: e.target.value } as any))}
                                                className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                                placeholder="Tu número de teléfono"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {profile?.rol === 'ORGANIZACION' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" /> CUIT
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.cuit}
                                        onChange={e => setProfile(prev => ({ ...prev!, cuit: e.target.value } as any))}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="border-t-2 border-gray-100 pt-8 mt-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Lock className="h-5 w-5 text-indigo-600" /> Seguridad
                            </h2>
                            <div className="space-y-2 max-w-md">
                                <label className="text-sm font-bold text-gray-700">Nueva Contraseña (dejar en blanco para no cambiar)</label>
                                <input
                                    type="password"
                                    value={profile?.contraseña || ""}
                                    onChange={e => setProfile(prev => ({ ...prev!, contraseña: e.target.value } as any))}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-indigo-200"
                            >
                                {saving ? "Guardando..." : <><Save className="h-5 w-5" /> Guardar Cambios</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
