"use client";

interface PieChartProps {
    data: { label: string; value: number }[];
    title: string;
}

export default function PieChart({ data, title }: PieChartProps) {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    // Filter out zero values for the chart but keep them for legend if needed (usually better to hide)
    const activeData = data.filter(d => d.value > 0);

    if (total === 0) {
        return (
            <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-400">No hay datos para mostrar</p>
            </div>
        )
    }

    let cumulativePercent = 0;

    function getCoordinatesForPercent(percent: number) {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    }

    const slices = activeData.map((slice, index) => {
        const startPercent = cumulativePercent; // 0 to 1
        const slicePercent = slice.value / total;
        cumulativePercent += slicePercent;
        const endPercent = cumulativePercent;

        // Calculate path
        const [startX, startY] = getCoordinatesForPercent(startPercent);
        const [endX, endY] = getCoordinatesForPercent(endPercent);

        // If slice is 100%, draw a full circle
        const isFullCircle = slicePercent === 1;
        const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

        const pathData = isFullCircle
            ? `M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0` // Full circle path
            : `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

        // Modern distinct colors
        const colors = [
            "#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
            "#EC4899", "#06B6D4", "#84CC16", "#6366F1", "#14B8A6"
        ];

        return {
            path: pathData,
            color: colors[index % colors.length],
            label: slice.label,
            value: slice.value,
            percent: (slicePercent * 100).toFixed(1)
        };
    });

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Chart */}
                <div className="relative w-64 h-64 shrink-0">
                    <svg viewBox="-1 -1 2 2" style={{ transform: "rotate(-90deg)" }} className="w-full h-full">
                        {slices.map((slice, i) => (
                            <path
                                key={i}
                                d={slice.path}
                                fill={slice.color}
                                className="hover:opacity-90 transition-opacity cursor-pointer stroke-white stroke-[0.02]"
                            >
                                <title>{`${slice.label}: $${slice.value} (${slice.percent}%)`}</title>
                            </path>
                        ))}
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 overflow-y-auto max-h-64 w-full">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {slices.map((slice, i) => (
                            <div key={i} className="flex items-center text-sm text-gray-600">
                                <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: slice.color }}></span>
                                <span className="truncate flex-1 mr-2">{slice.label} hrs</span>
                                <span className="font-semibold">{slice.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
