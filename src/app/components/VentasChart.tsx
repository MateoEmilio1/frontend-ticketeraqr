"use client";

interface VentasChartProps {
    data: { hora: string; cantidad: number; recaudacion: number }[];
    type: "cantidad" | "recaudacion";
}

export default function VentasChart({ data, type }: VentasChartProps) {
    const maxValue = Math.max(...data.map((d) => (type === "cantidad" ? d.cantidad : d.recaudacion)), 1);

    // Calculate ticks
    let ticks: number[] = [];
    if (maxValue <= 20) {
        // Step 1 by 1 for small ranges
        ticks = Array.from({ length: maxValue + 1 }, (_, i) => i);
    } else {
        // 5 steps auto for larger ranges
        const step = Math.ceil(maxValue / 5);
        for (let i = 0; i <= 5; i++) {
            ticks.push(i * step);
        }
    }

    // Ensure unique and sorted ticks
    ticks = [...new Set(ticks)].sort((a, b) => a - b);
    const maxTick = ticks[ticks.length - 1] || 1;

    const CHART_HEIGHT = 300;
    const LABEL_HEIGHT = 40;

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
                {type === "cantidad" ? "Entradas Vendidas por Hora" : "Recaudación por Hora ($)"}
            </h3>
            <div className="flex w-full">
                {/* Y-Axis */}
                <div className="flex flex-col justify-between items-end text-xs text-gray-500 pr-3 border-r border-gray-100 mr-2 min-w-[30px]" style={{ height: CHART_HEIGHT }}>
                    {ticks.slice().reverse().map((t) => (
                        <span key={t}>{t}</span>
                    ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 overflow-x-auto">
                    <div className="flex items-end gap-2" style={{ height: CHART_HEIGHT + LABEL_HEIGHT }}>
                        {data.map((d) => {
                            const value = type === "cantidad" ? d.cantidad : d.recaudacion;
                            const heightPx = (value / maxTick) * CHART_HEIGHT;

                            return (
                                <div key={d.hora} className="flex flex-col justify-end items-center group min-w-[30px]" style={{ height: '100%' }}>
                                    {/* Bar Area */}
                                    <div className="w-full relative flex items-end justify-center" style={{ height: CHART_HEIGHT }}>
                                        {/* Tooltip */}
                                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                            {d.hora}: {value}
                                        </div>
                                        {/* Bar */}
                                        <div
                                            className={`w-full rounded-t-sm transition-all duration-500 ${type === "cantidad" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                                            style={{ height: heightPx, minHeight: value > 0 ? 4 : 0 }}
                                        ></div>
                                    </div>
                                    {/* Label */}
                                    <div className="flex items-center justify-center text-[10px] text-gray-400" style={{ height: LABEL_HEIGHT }}>
                                        <span className="-rotate-45">{d.hora}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
