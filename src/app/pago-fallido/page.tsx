import Link from 'next/link';

export default function PagoFallidoPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <h1 className="text-3xl font-bold text-red-600 mb-4">¡Pago Fallido!</h1>
            <p className="text-gray-700 mb-8">Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
            <Link href="/" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Volver al Inicio
            </Link>
        </div>
    );
}
