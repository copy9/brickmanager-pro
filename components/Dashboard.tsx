
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { InventoryItem, Sale, Expense } from '../types';

interface DashboardProps {
  items: InventoryItem[];
  sales: Sale[];
  expenses: Expense[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ items, sales, expenses }) => {
  const grossProfit = sales.reduce((acc, curr) => acc + curr.profit, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = grossProfit - totalExpenses;
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.saleAmount, 0);

  // Agrupamento Mensal (últimos 6 meses)
  const getMonthlyData = () => {
    const months: any = {};
    const now = new Date();
    
    for(let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      months[key] = { label, lucroBruto: 0, gastos: 0, liquido: 0 };
    }

    sales.forEach(s => {
      const d = new Date(s.saleDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if(months[key]) months[key].lucroBruto += s.profit;
    });

    expenses.forEach(e => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if(months[key]) months[key].gastos += e.amount;
    });

    return Object.values(months).map((m: any) => ({
      ...m,
      liquido: m.lucroBruto - m.gastos
    }));
  };

  const monthlyChartData = getMonthlyData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faturamento Total', value: `R$ ${totalRevenue.toLocaleString()}`, color: 'text-blue-600', icon: '💰' },
          { label: 'Lucro Bruto (Vendas)', value: `R$ ${grossProfit.toLocaleString()}`, color: 'text-green-600', icon: '📈' },
          { label: 'Despesas Totais', value: `R$ ${totalExpenses.toLocaleString()}`, color: 'text-red-600', icon: '📉' },
          { label: 'LUCRO LÍQUIDO', value: `R$ ${netProfit.toLocaleString()}`, color: netProfit >= 0 ? 'text-indigo-600' : 'text-red-800', icon: '💎' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
              <p className={`text-2xl font-black mt-1 ${card.color}`}>{card.value}</p>
            </div>
            <span className="text-3xl opacity-80 bg-gray-50 p-2 rounded-lg">{card.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span>📅</span> Comparativo Mensal (Anual)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="lucroBruto" fill="#10b981" name="L. Bruto" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" fill="#ef4444" name="Gastos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="liquido" fill="#6366f1" name="L. Líquido" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span>📊</span> Composição de Gastos
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.values(expenses.reduce((acc: any, curr) => {
                    acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 };
                    acc[curr.category].value += curr.amount;
                    return acc;
                  }, {}))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
