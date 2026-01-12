
import React, { useState, useEffect } from 'react';
import { InventoryItem, Sale, Expense, ItemStatus, Category, ItemCondition, ExpenseCategory } from './types';
import { Dashboard } from './components/Dashboard';
import { InventoryTable } from './components/InventoryTable';
import { ItemModal } from './components/ItemModal';
import { SaleModal } from './components/SaleModal';
import { SalesTable } from './components/SalesTable';
import { ExpenseModal } from './components/ExpenseModal';
import { ExpensesTable } from './components/ExpensesTable';

const STORAGE_KEY_ITEMS = 'brickmanager_items';
const STORAGE_KEY_SALES = 'brickmanager_sales';
const STORAGE_KEY_EXPENSES = 'brickmanager_expenses';

const App: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [view, setView] = useState<'dashboard' | 'inventory' | 'sales' | 'expenses'>('dashboard');
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
    const savedSales = localStorage.getItem(STORAGE_KEY_SALES);
    const savedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
    
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(sales));
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [items, sales, expenses]);

  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    if (currentItem) {
      setItems(prev => prev.map(i => i.id === currentItem.id ? { ...i, ...itemData } as InventoryItem : i));
    } else {
      const newItem: InventoryItem = {
        ...itemData,
        id: Math.random().toString(36).substr(2, 9),
        dateAdded: new Date().toISOString(),
        status: ItemStatus.AVAILABLE
      } as InventoryItem;
      setItems(prev => [...prev, newItem]);
    }
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Excluir item do estoque?')) setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleCompleteSale = (saleData: { amount: number, paymentMethod: any }) => {
    if (!currentItem) return;
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: currentItem.id,
      itemName: currentItem.name,
      saleDate: new Date().toISOString(),
      saleAmount: saleData.amount,
      paymentMethod: saleData.paymentMethod,
      profit: saleData.amount - currentItem.costPrice
    };
    setSales(prev => [...prev, newSale]);
    setItems(prev => prev.map(i => i.id === currentItem.id ? { ...i, status: ItemStatus.SOLD } : i));
    setIsSaleModalOpen(false);
    setCurrentItem(null);
  };

  const handleSaveExpense = (expenseData: Partial<Expense>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
    } as Expense;
    setExpenses(prev => [...prev, newExpense]);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Remover este gasto?')) setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🧱</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BrickManager Pro
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'inventory', label: 'Estoque', icon: '📦' },
                { id: 'sales', label: 'Vendas', icon: '💰' },
                { id: 'expenses', label: 'Despesas', icon: '📉' }
              ].map(nav => (
                <button 
                  key={nav.id}
                  onClick={() => setView(nav.id as any)}
                  className={`text-sm font-medium transition-all h-16 flex items-center gap-2 border-b-2 ${view === nav.id ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  <span>{nav.icon}</span> {nav.label}
                </button>
              ))}
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => { setCurrentItem(null); setIsItemModalOpen(true); }}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  + ITEM
                </button>
                <button 
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 shadow-sm"
                >
                  + GASTO
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && <Dashboard items={items} sales={sales} expenses={expenses} />}
        
        {view === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">📦 Inventário de Peças</h1>
              <button onClick={() => { setCurrentItem(null); setIsItemModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">+ Novo Item</button>
            </div>
            <InventoryTable items={items} onEdit={(item) => { setCurrentItem(item); setIsItemModalOpen(true); }} onSell={(item) => { setCurrentItem(item); setIsSaleModalOpen(true); }} onDelete={handleDeleteItem} />
          </div>
        )}

        {view === 'sales' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">💰 Histórico de Vendas</h1>
            <SalesTable sales={sales} />
          </div>
        )}

        {view === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">📉 Controle de Gastos</h1>
              <button onClick={() => setIsExpenseModalOpen(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">+ Novo Gasto</button>
            </div>
            <ExpensesTable expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-40">
        {[
          { id: 'dashboard', icon: '📊', label: 'Resumo' },
          { id: 'inventory', icon: '📦', label: 'Itens' },
          { id: 'sales', icon: '💰', label: 'Vendas' },
          { id: 'expenses', icon: '📉', label: 'Gastos' }
        ].map(nav => (
          <button 
            key={nav.id} 
            onClick={() => setView(nav.id as any)}
            className={`flex flex-col items-center gap-0.5 px-2 ${view === nav.id ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <span className="text-xl">{nav.icon}</span>
            <span className="text-[10px] uppercase font-bold">{nav.label}</span>
          </button>
        ))}
      </div>

      <ItemModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} onSave={handleSaveItem} initialItem={currentItem} />
      <SaleModal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} onConfirm={handleCompleteSale} item={currentItem} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSave={handleSaveExpense} />
    </div>
  );
};

export default App;
