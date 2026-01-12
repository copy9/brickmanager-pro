
import React from 'react';
import { Expense } from '../types';

interface ExpensesTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl text-center text-gray-500 border-2 border-dashed border-gray-200">
        Nenhuma despesa registrada. Ótimo sinal! 📉
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
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...expenses].sort((a,b) => b.date.localeCompare(a.date)).map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(exp.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{exp.description}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-semibold">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-red-600 font-bold">R$ {exp.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onDelete(exp.id)} className="text-gray-400 hover:text-red-600 transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
