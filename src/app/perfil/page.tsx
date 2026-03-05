"use client";

import { useState, useEffect } from "react";
import { User, Lock, Mail, Save, MapPin, Building2, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateCliente, getClienteByUsuarioId } from "@/app/services/clientService";
import { updateOrganizacion, getOrganizacionByUsuarioId } from "@/app/services/organizacionService";
import { ClienteFormData } from "@/types/cliente";
import { OrganizacionFormData } from "@/types/organizacion";

type ProfileData =
    | (ClienteFormData & { rol: "CLIENTE" })
    | (OrganizacionFormData & { rol: "ORGANIZACION" })
    | { rol: "ADMIN"; nombre: string; mail: string; contraseña?: string };

export default function PerfilPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [message, setMessage] = useState({ text: "", type: "" });

    const { user } = useAuth();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!user) return;
                // Standardize ID: JWT has 'id', some services might have 'idUsuario'
                const userId = (user as { id?: string | number, idUsuario?: string | number }).id || user.idUsuario;
                const userRole = user.rol;

                if (!userId || !userRole) {
                    console.error("Missing credentials in user object:", user);
                    throw new Error("No hay sesión activa");
                }

                if (userRole === "CLIENTE") {
                    const clientData = await getClienteByUsuarioId(parseInt(userId as string));

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
                    } as ProfileData);
                } else if (userRole === "ORGANIZACION") {
                    const orgData = await getOrganizacionByUsuarioId(parseInt(userId as string));
                    setProfile({
                        rol: "ORGANIZACION",
                        idOrganizacion: orgData.idOrganizacion,
                        nombre: orgData.nombre,
                        ubicacion: orgData.ubicacion,
                        cuit: orgData.cuit,
                        mail: orgData.usuario.mail,
                        contraseña: ""
                    });
                } else if (userRole === "ADMIN") {
                    setProfile({
                        rol: "ADMIN",
                        nombre: "Administrador",
                        mail: user.mail,
                        contraseña: ""
                    } as ProfileData);
                }
            } catch (error) {
                console.error("Error cargando perfil:", error);
                setMessage({ text: "Error al cargar el perfil", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadProfile();
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            if (profile.rol === "CLIENTE" && profile.idCliente) {
                const fullPhone = profile.telefono ? `${('prefijo' in profile ? profile.prefijo : "+54")}${profile.telefono}` : "";
                await updateCliente(profile.idCliente, { ...profile, telefono: fullPhone });
            } else if (profile.rol === "ORGANIZACION" && profile.idOrganizacion) {
                await updateOrganizacion(profile.idOrganizacion, profile);
            }

            setMessage({ text: "Perfil actualizado con éxito", type: "success" });
            setProfile(prev => prev ? { ...prev, contraseña: "" } : null);
        } catch (error: any) {
            console.error("Error actualizando perfil:", error);
            if (error.isValidationError && error.details) {
                const errorStr = error.details.map((d: any) => d.message).join(", ");
                setMessage({ text: errorStr, type: "error" });
            } else {
                setMessage({ text: (error as Error).message || "Ocurrió un error", type: "error" });
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10 text-xl font-semibold">Cargando perfil...</div>;

    return (
        <div className="min-h-screen bg-gray-50 uppercase">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-indigo-600 px-8 py-10 text-white">
                        <h1 className="text-3xl font-extrabold flex items-center gap-3">
                            <User className="h-8 w-8" /> Mi Perfil
                        </h1>
                        <p className="mt-2 text-indigo-100 italic">
                            Actualiza tu información {profile?.rol === 'ORGANIZACION' ? 'de la organización' : profile?.rol === 'ADMIN' ? 'de administrador' : 'personal'} y contraseña
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {message.text && (
                            <div className={`p-4 rounded-lg font-medium text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {(profile?.rol === 'CLIENTE' || profile?.rol === 'ORGANIZACION' || profile?.rol === 'ADMIN') && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" /> {profile?.rol === 'ORGANIZACION' ? 'Nombre de Organización' : 'Nombre'}
                                    </label>
                                    <input
                                        type="text"
                                        value={profile?.nombre || ""}
                                        onChange={e => setProfile(prev => ({ ...prev!, nombre: e.target.value } as ProfileData))}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none disabled:bg-gray-50"
                                        required
                                        disabled={profile?.rol === 'ADMIN'}
                                    />
                                </div>
                            )}

                            {profile?.rol === 'CLIENTE' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Apellido</label>
                                    <input
                                        type="text"
                                        value={profile.apellido}
                                        onChange={e => setProfile(prev => ({ ...prev!, apellido: e.target.value } as ProfileData))}
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
                                        onChange={e => setProfile(prev => ({ ...prev!, ubicacion: e.target.value } as ProfileData))}
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
                                    onChange={e => setProfile(prev => ({ ...prev!, mail: e.target.value } as ProfileData))}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none disabled:bg-gray-50"
                                    required
                                    disabled={profile?.rol === 'ADMIN'}
                                />
                            </div>

                            {profile?.rol === 'CLIENTE' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            value={profile.fechaNacimiento}
                                            onChange={e => setProfile(prev => ({ ...prev!, fechaNacimiento: e.target.value } as ProfileData))}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tipo de Documento</label>
                                        <input
                                            type="text"
                                            value={profile.tipoDoc}
                                            onChange={e => setProfile(prev => ({ ...prev!, tipoDoc: e.target.value } as ProfileData))}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nro de Documento</label>
                                        <input
                                            type="text"
                                            value={profile.nroDoc}
                                            onChange={e => setProfile(prev => ({ ...prev!, nroDoc: e.target.value } as ProfileData))}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    {/* Teléfono */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Teléfono</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={('prefijo' in profile ? profile.prefijo : "+54")}
                                                onChange={e => setProfile(prev => ({ ...prev!, prefijo: e.target.value } as ProfileData))}
                                                className="w-36 px-2 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none bg-white"
                                            >
                                                <option value="+93">Afganistán (+93)</option>
                                                <option value="+355">Albania (+355)</option>
                                                <option value="+213">Argelia (+213)</option>
                                                <option value="+376">Andorra (+376)</option>
                                                <option value="+244">Angola (+244)</option>
                                                <option value="+54">Argentina (+54)</option>
                                                <option value="+374">Armenia (+374)</option>
                                                <option value="+297">Aruba (+297)</option>
                                                <option value="+61">Australia (+61)</option>
                                                <option value="+43">Austria (+43)</option>
                                                <option value="+994">Azerbaiyán (+994)</option>
                                                <option value="+973">Baréin (+973)</option>
                                                <option value="+880">Bangladesh (+880)</option>
                                                <option value="+375">Bielorrusia (+375)</option>
                                                <option value="+32">Bélgica (+32)</option>
                                                <option value="+501">Belice (+501)</option>
                                                <option value="+229">Benín (+229)</option>
                                                <option value="+975">Bután (+975)</option>
                                                <option value="+591">Bolivia (+591)</option>
                                                <option value="+387">Bosnia y Herzegovina (+387)</option>
                                                <option value="+267">Botsuana (+267)</option>
                                                <option value="+55">Brasil (+55)</option>
                                                <option value="+673">Brunéi (+673)</option>
                                                <option value="+359">Bulgaria (+359)</option>
                                                <option value="+226">Burkina Faso (+226)</option>
                                                <option value="+257">Burundi (+257)</option>
                                                <option value="+855">Camboya (+855)</option>
                                                <option value="+237">Camerún (+237)</option>
                                                <option value="+1">Canadá/EE. UU. (+1)</option>
                                                <option value="+238">Cabo Verde (+238)</option>
                                                <option value="+236">República Centroafricana (+236)</option>
                                                <option value="+235">Chad (+235)</option>
                                                <option value="+56">Chile (+56)</option>
                                                <option value="+86">China (+86)</option>
                                                <option value="+57">Colombia (+57)</option>
                                                <option value="+269">Comoras (+269)</option>
                                                <option value="+242">República del Congo (+242)</option>
                                                <option value="+243">República Democrática del Congo (+243)</option>
                                                <option value="+682">Islas Cook (+682)</option>
                                                <option value="+506">Costa Rica (+506)</option>
                                                <option value="+225">Costa de Marfil (+225)</option>
                                                <option value="+385">Croacia (+385)</option>
                                                <option value="+53">Cuba/República Dominicana (+53)</option>
                                                <option value="+357">Chipre (+357)</option>
                                                <option value="+420">República Checa (+420)</option>
                                                <option value="+45">Dinamarca (+45)</option>
                                                <option value="+253">Yibuti (+253)</option>
                                                <option value="+670">Timor Oriental (+670)</option>
                                                <option value="+593">Ecuador (+593)</option>
                                                <option value="+20">Egipto (+20)</option>
                                                <option value="+503">El Salvador (+503)</option>
                                                <option value="+240">Guinea Ecuatorial (+240)</option>
                                                <option value="+291">Eritrea (+291)</option>
                                                <option value="+372">Estonia (+372)</option>
                                                <option value="+251">Etiopía (+251)</option>
                                                <option value="+298">Islas Feroe (+298)</option>
                                                <option value="+679">Fiyi (+679)</option>
                                                <option value="+358">Finlandia (+358)</option>
                                                <option value="+33">Francia (+33)</option>
                                                <option value="+241">Gabón (+241)</option>
                                                <option value="+995">Georgia (+995)</option>
                                                <option value="+49">Alemania (+49)</option>
                                                <option value="+233">Ghana (+233)</option>
                                                <option value="+350">Gibraltar (+350)</option>
                                                <option value="+30">Grecia (+30)</option>
                                                <option value="+502">Guatemala (+502)</option>
                                                <option value="+224">Guinea (+224)</option>
                                                <option value="+245">Guinea-Bisáu (+245)</option>
                                                <option value="+592">Guyana (+592)</option>
                                                <option value="+509">Haití (+509)</option>
                                                <option value="+504">Honduras (+504)</option>
                                                <option value="+36">Hungría (+36)</option>
                                                <option value="+354">Islandia (+354)</option>
                                                <option value="+91">India (+91)</option>
                                                <option value="+62">Indonesia (+62)</option>
                                                <option value="+964">Irak (+964)</option>
                                                <option value="+98">Irán (+98)</option>
                                                <option value="+353">Irlanda (+353)</option>
                                                <option value="+39">Italia (+39)</option>
                                                <option value="+1876">Jamaica (+1876)</option>
                                                <option value="+81">Japón (+81)</option>
                                                <option value="+962">Jordania (+962)</option>
                                                <option value="+7">Kazajistán/Kirguistán/Rusia (+7)</option>
                                                <option value="+254">Kenia (+254)</option>
                                                <option value="+686">Kiribati (+686)</option>
                                                <option value="+965">Kuwait (+965)</option>
                                                <option value="+996">Kirguistán (+996)</option>
                                                <option value="+856">Laos (+856)</option>
                                                <option value="+371">Letonia (+371)</option>
                                                <option value="+961">Líbano (+961)</option>
                                                <option value="+266">Lesoto (+266)</option>
                                                <option value="+231">Liberia (+231)</option>
                                                <option value="+218">Libia (+218)</option>
                                                <option value="+423">Liechtenstein (+423)</option>
                                                <option value="+370">Lituania (+370)</option>
                                                <option value="+352">Luxemburgo (+352)</option>
                                                <option value="+853">Macao (+853)</option>
                                                <option value="+389">Macedonia del Norte (+389)</option>
                                                <option value="+261">Madagascar (+261)</option>
                                                <option value="+265">Malaui (+265)</option>
                                                <option value="+60">Malasia (+60)</option>
                                                <option value="+960">Maldivas (+960)</option>
                                                <option value="+223">Malí (+223)</option>
                                                <option value="+356">Malta (+356)</option>
                                                <option value="+692">Islas Marshall (+692)</option>
                                                <option value="+596">Martinica (+596)</option>
                                                <option value="+222">Mauritania (+222)</option>
                                                <option value="+230">Mauricio (+230)</option>
                                                <option value="+52">México (+52)</option>
                                                <option value="+691">Micronesia (+691)</option>
                                                <option value="+373">Moldavia (+373)</option>
                                                <option value="+377">Mónaco (+377)</option>
                                                <option value="+976">Mongolia (+976)</option>
                                                <option value="+382">Montenegro (+382)</option>
                                                <option value="+212">Marruecos (+212)</option>
                                                <option value="+258">Mozambique (+258)</option>
                                                <option value="+95">Myanmar (+95)</option>
                                                <option value="+264">Namibia (+264)</option>
                                                <option value="+674">Nauru (+674)</option>
                                                <option value="+977">Nepal (+977)</option>
                                                <option value="+31">Países Bajos (+31)</option>
                                                <option value="+687">Nueva Caledonia (+687)</option>
                                                <option value="+64">Nueva Zelanda (+64)</option>
                                                <option value="+505">Nicaragua (+505)</option>
                                                <option value="+227">Níger (+227)</option>
                                                <option value="+234">Nigeria (+234)</option>
                                                <option value="+683">Niue (+683)</option>
                                                <option value="+850">Corea del Norte (+850)</option>
                                                <option value="+47">Noruega (+47)</option>
                                                <option value="+968">Omán (+968)</option>
                                                <option value="+92">Pakistán (+92)</option>
                                                <option value="+680">Palaos (+680)</option>
                                                <option value="+507">Panamá (+507)</option>
                                                <option value="+675">Papúa Nueva Guinea (+675)</option>
                                                <option value="+595">Paraguay (+595)</option>
                                                <option value="+51">Perú (+51)</option>
                                                <option value="+63">Filipinas (+63)</option>
                                                <option value="+48">Polonia (+48)</option>
                                                <option value="+351">Portugal (+351)</option>
                                                <option value="+974">Catar (+974)</option>
                                                <option value="+40">Rumania (+40)</option>
                                                <option value="+250">Ruanda (+250)</option>
                                                <option value="+685">Samoa (+685)</option>
                                                <option value="+378">San Marino (+378)</option>
                                                <option value="+239">Santo Tomé y Príncipe (+239)</option>
                                                <option value="+966">Arabia Saudita (+966)</option>
                                                <option value="+221">Senegal (+221)</option>
                                                <option value="+381">Serbia (+381)</option>
                                                <option value="+248">Seychelles (+248)</option>
                                                <option value="+232">Sierra Leona (+232)</option>
                                                <option value="+65">Singapur (+65)</option>
                                                <option value="+421">Eslovaquia (+421)</option>
                                                <option value="+386">Eslovenia (+386)</option>
                                                <option value="+677">Islas Salomón (+677)</option>
                                                <option value="+252">Somalia (+252)</option>
                                                <option value="+27">Sudáfrica (+27)</option>
                                                <option value="+211">Sudán del Sur (+211)</option>
                                                <option value="+249">Sudán (+249)</option>
                                                <option value="+46">Suecia (+46)</option>
                                                <option value="+41">Suiza (+41)</option>
                                                <option value="+963">Siria (+963)</option>
                                                <option value="+886">Taiwán (+886)</option>
                                                <option value="+66">Tailandia (+66)</option>
                                                <option value="+992">Tayikistán (+992)</option>
                                                <option value="+228">Togo (+228)</option>
                                                <option value="+676">Tonga (+676)</option>
                                                <option value="+1868">Trinidad y Tobago (+1868)</option>
                                                <option value="+216">Túnez (+216)</option>
                                                <option value="+90">Turquía (+90)</option>
                                                <option value="+993">Turkmenistán (+993)</option>
                                                <option value="+1649">Islas Turcas y Caicos (+1649)</option>
                                                <option value="+688">Tuvalu (+688)</option>
                                                <option value="+256">Uganda (+256)</option>
                                                <option value="+380">Ucrania (+380)</option>
                                                <option value="+971">Emiratos Árabes Unidos (+971)</option>
                                                <option value="+44">Reino Unido (+44)</option>
                                                <option value="+598">Uruguay (+598)</option>
                                                <option value="+998">Uzbekistán (+998)</option>
                                                <option value="+678">Vanuatu (+678)</option>
                                                <option value="+58">Venezuela (+58)</option>
                                                <option value="+84">Vietnam (+84)</option>
                                                <option value="+681">Wallis y Futuna (+681)</option>
                                                <option value="+967">Yemen (+967)</option>
                                                <option value="+260">Zambia (+260)</option>
                                                <option value="+263">Zimbabue (+263)</option>
                                            </select>

                                            <input
                                                type="tel"
                                                value={profile.telefono || ""}
                                                onChange={e => setProfile(prev => ({ ...prev!, telefono: e.target.value } as ProfileData))}
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
                                        onChange={e => setProfile(prev => ({ ...prev!, cuit: e.target.value } as ProfileData))}
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
                                    onChange={e => setProfile(prev => ({ ...prev!, contraseña: e.target.value } as ProfileData))}
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
