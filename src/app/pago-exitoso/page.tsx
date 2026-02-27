import Link from "next/link";
import { CheckCircle, Ticket as TicketIcon } from "lucide-react";
import Footer from "@/app/components/footer";

export default function PagoExitosoPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 uppercase">
            <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border-t-8 border-green-500 animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-2">¡Pago Confirmado!</h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Tu compra se ha procesado correctamente. Ya tienes tu entrada asegurada.
                    </p>

                    <div className="bg-green-50 rounded-xl p-4 mb-8 border border-green-100">
                        <p className="text-sm text-green-800 font-medium">
                            En unos instantes recibirás un correo con el comprobante.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2 group"
                        >
                            <TicketIcon className="w-5 h-5" />
                            Realizar otra compra
                        </Link>
                        <Link
                            href="/clientes/mis-tickets"
                            className="w-full py-3 text-gray-500 font-bold hover:text-gray-800 transition rounded-xl hover:bg-gray-100"
                        >
                            Ir a mis tickets
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
