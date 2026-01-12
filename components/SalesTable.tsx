
import React from 'react';
import { Sale } from '../types';

interface SalesTableProps {
  sales: Sale[];
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales }) => {
  if (sales.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl text-center text-gray-500 border-2 border-dashed border-gray-200">
        Nenhuma venda registrada ainda. Que tal vender algo hoje? 📈
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Pagamento</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Lucro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...sales].reverse().map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(sale.saleDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{sale.itemName}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">
                    {sale.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm font-bold">R$ {sale.saleAmount.toFixed(2)}</td>
                <td className="px-6 py-4 font-mono text-sm text-green-600 font-bold">
                  + R$ {sale.profit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
