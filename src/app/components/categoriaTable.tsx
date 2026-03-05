import { Categoria } from "@/types/categoria";

interface CategoriaTableProps {
  categorias: Categoria[];
  loading: boolean;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

export const CategoriaTable: React.FC<CategoriaTableProps> = ({
  categorias,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="categoria-table-wrapper">
      <table className="categoria-table w-full border">
        <thead>
          <tr>
            <th className="text-left p-2 border">Nombre</th>
            <th className="text-left p-2 border w-32">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.idCategoria}>
              <td className="p-2 border">{categoria.nombreCategoria}</td>
              <td className="p-2 border">
                <div className="flex justify-center">
                  <button onClick={() => onDelete(categoria)} className="btn-delete">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="p-4 text-center text-muted-foreground">
          Cargando...
        </div>
      )}
    </div>
  );
};
