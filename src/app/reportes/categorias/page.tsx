"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getReporteCategoria } from "@/app/services/categoriaService";
import { getOrganizacionByUsuarioId } from "@/app/services/organizacionService";
import Footer from "@/app/components/footer";
import { BarChart3, PieChart as PieChartIcon, Table as TableIcon, LayoutDashboard } from "lucide-react";
import PieChart from "@/app/components/PieChart";

export default function ReporteCategoriasPage() {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [idOrg, setIdOrg] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrg = async () => {
            if (user?.rol === "ORGANIZACION" && user.idUsuario) {
                try {
                    const org = await getOrganizacionByUsuarioId(Number(user.idUsuario));
                    setIdOrg(org.idOrganizacion);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        fetchOrg();
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getReporteCategoria(idOrg || undefined);
                setData(result);
            } catch (error) {
                console.error("Error fetching category report:", error);
            } finally {
                setLoading(false);
            }
        };
        if (user && (user.rol === 'ADMIN' || (user.rol === 'ORGANIZACION' && idOrg))) {
            fetchData();
        } else if (user && user.rol === 'ORGANIZACION' && !idOrg) {
            // Wait for Org ID
        } else {
            setLoading(false);
        }
    }, [user, idOrg]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold">Generando reporte...</p>
            </div>
        </div>
    );

    const totals = data.reduce((acc, cat) => ({
        events: acc.events + cat.cantidadEventos,
        sold: acc.sold + cat.ticketsVendidos,
        revenue: acc.revenue + cat.recaudacionTotal
    }), { events: 0, sold: 0, revenue: 0 });

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 uppercase">
            <main className="container mx-auto px-6 py-12 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                            <BarChart3 className="w-10 h-10 text-blue-600" />
                            Reporte por Categoría
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Análisis consolidado de eventos y ventas agrupado por categoría</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
                        <div className="text-center px-4 border-r border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase">Total Eventos</p>
                            <p className="text-2xl font-black text-gray-900">{totals.events}</p>
                        </div>
                        <div className="text-center px-4 border-r border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase">Tickets Vendidos</p>
                            <p className="text-2xl font-black text-blue-600">{totals.sold}</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xs font-bold text-gray-400 uppercase">Recaudación</p>
                            <p className="text-2xl font-black text-green-600">${totals.revenue}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-blue-500" />
                            Distribución de Ventas
                        </h3>
                        <div className="h-80">
                            <PieChart
                                title="Tickets por Categoría"
                                data={data.map(c => ({ label: c.nombre, value: c.ticketsVendidos }))}
                            />
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-green-500" />
                            Recaudación por Categoría
                        </h3>
                        <div className="h-80">
                            <PieChart
                                title="Ingresos ($)"
                                data={data.map(c => ({ label: c.nombre, value: c.recaudacionTotal }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <TableIcon className="w-6 h-6 text-gray-400" />
                            Detalle de Categorías
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100/50 text-gray-600">
                                    <th className="px-8 py-5 font-bold uppercase text-xs tracking-widest">Categoría</th>
                                    <th className="px-8 py-5 font-bold uppercase text-xs tracking-widest text-center">Eventos</th>
                                    <th className="px-8 py-5 font-bold uppercase text-xs tracking-widest text-center">Tickets Vendidos</th>
                                    <th className="px-8 py-5 font-bold uppercase text-xs tracking-widest text-right">Recaudación Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((cat) => (
                                    <tr key={cat.idCategoria} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{cat.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                                                {cat.cantidadEventos}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center font-bold text-blue-600">
                                            {cat.ticketsVendidos}
                                        </td>
                                        <td className="px-8 py-6 text-right font-black text-green-600 text-lg">
                                            ${cat.recaudacionTotal}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
