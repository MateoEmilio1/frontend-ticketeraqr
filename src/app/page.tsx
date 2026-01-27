import Footer from "@/app/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">



      {/* Contenido */}
      <main className="flex flex-col items-center justify-center flex-1 text-center p-8 sm:p-20">
        <h1 className="text-4xl font-bold text-gray-900">
          Bienvenidos a Ticketera QR
        </h1>

        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          Gestioná tus eventos de manera rápida y eficiente con nuestra
          plataforma.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
