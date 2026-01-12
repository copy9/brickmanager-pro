
import React, { useState } from 'react';
import { InventoryItem, ItemStatus, Category } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onSell: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onSell, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filter.toLowerCase()) || 
                          item.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar itens..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <select 
          className="w-full md:w-48 p-2 border border-gray-200 rounded-lg"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">Todas Categorias</option>
          {Object.values(Category).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Preço Custo</th>
              <th className="px-6 py-4">Preço Venda</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{item.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === ItemStatus.AVAILABLE ? 'bg-green-100 text-green-700' :
                    item.status === ItemStatus.SOLD ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-500">R$ {item.costPrice.toFixed(2)}</td>
                <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">R$ {item.salePrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {item.status === ItemStatus.AVAILABLE ? (
                    <button 
                      onClick={() => onSell(item)}
                      className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-sm"
                      title="Vender Agora"
                    >
                      💰
                    </button>
                  ) : (
                    <div className="p-1.5 bg-gray-100 text-gray-400 rounded cursor-not-allowed">
                      ✅
                    </div>
                  )}
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum item encontrado.
          </div>
        )}
      </div>
    </div>
  );
};
