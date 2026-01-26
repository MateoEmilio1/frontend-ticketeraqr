import { Politica } from "@/types/politica";

interface PoliticaTableProps {
    politicas: Politica[];
    loading: boolean;
}

export const PoliticaTable: React.FC<PoliticaTableProps> = ({
    politicas,
    loading,
}) => {
    if (loading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-center text-gray-500">Cargando políticas...</p>
            </div>
        );
    }

    if (politicas.length === 0) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-center text-gray-500">No hay políticas registradas</p>
            </div>
        );
    }

    const politicasOrdenadas = [...politicas].sort(
        (a, b) =>
            new Date(b.fechaVigencia).getTime() - new Date(a.fechaVigencia).getTime()
    );

    const idPoliticaActual = politicasOrdenadas[0]?.fechaVigencia;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Días de Reembolso
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha de Vigencia
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {politicasOrdenadas.map((politica, index) => {
                            const esActual = politica.fechaVigencia === idPoliticaActual;
                            return (
                                <tr
                                    key={politica.fechaVigencia || index}
                                    className={esActual ? "bg-blue-50" : "hover:bg-gray-50"}
                                >
                                    <td className="px-4 py-3 text-sm">
                                        <span className="font-semibold text-blue-600">
                                            {politica.diasReembolso} días
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {new Date(politica.fechaVigencia).toLocaleString("es-AR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {esActual ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                ✓ Vigente
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Histórica
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PoliticaTable;
