import React from "react";

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
        <h3 className="text-lg font-bold mb-2">¿Estás seguro?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Esta acción eliminará la categoría <strong>{itemName}</strong> de forma permanente.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Sí, eliminar
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
