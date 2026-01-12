
import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Partial<Expense>) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Expense>>({
    description: '',
    amount: 0,
    category: ExpenseCategory.OTHER,
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-6">Nova Despesa</h2>
        
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <input
              required
              className="mt-1 w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Aluguel do Galpão"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                required
                className="mt-1 w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              className="mt-1 w-full p-2 border rounded-lg"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
            >
              {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-md">Salvar Gasto</button>
          </div>
        </form>
      </div>
    </div>
  );
};
