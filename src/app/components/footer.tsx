export default function Footer() {
  return (
    <footer className="w-full bg-white text-gray-900 py-6 mt-10">
      <div className="max-w-7xl mx-auto text-center text-sm">
        © {new Date().getFullYear()} Mi Proyecto. Todos los derechos reservados.
      </div>
    </footer>
  );
}
