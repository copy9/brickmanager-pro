
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (saleData: { amount: number, paymentMethod: any }) => void;
  item: InventoryItem | null;
}

export const SaleModal: React.FC<SaleModalProps> = ({ isOpen, onClose, onConfirm, item }) => {
  const [salePrice, setSalePrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'PIX' | 'Cartão' | 'Outro'>('PIX');

  useEffect(() => {
    if (item) setSalePrice(item.salePrice);
  }, [item]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-4">Confirmar Venda</h2>
        <p className="text-gray-600 mb-6 italic text-sm">Registrando venda de: <strong>{item.name}</strong></p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Final da Venda (R$)</label>
            <input
              type="number"
              className="mt-1 w-full p-3 border-2 border-green-100 rounded-lg focus:border-green-500 outline-none text-xl font-bold text-green-700"
              value={salePrice}
              onChange={(e) => setSalePrice(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
            <select
              className="mt-1 w-full p-2 border rounded-lg"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              <option value="PIX">PIX</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão">Cartão de Débito/Crédito</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Preço de Custo:</span>
              <span className="font-mono">R$ {item.costPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-indigo-600 mt-1">
              <span>Lucro Estimado:</span>
              <span className="font-mono">R$ {(salePrice - item.costPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
          <button
            onClick={() => onConfirm({ amount: salePrice, paymentMethod })}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
          >
            Confirmar e Baixar Estoque
          </button>
        </div>
      </div>
    </div>
  );
};
