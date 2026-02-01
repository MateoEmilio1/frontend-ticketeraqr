export default function PagoPendientePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
            <h1 className="text-3xl font-bold text-yellow-600 mb-4">¡Pago Pendiente!</h1>
            <p className="text-gray-700 mb-8">Tu pago está siendo procesado. Te avisaremos cuando se confirme.</p>
            <a href="/clientes/mis-tickets" className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                Ver Mis Tickets
            </a>
        </div>
    );
}
