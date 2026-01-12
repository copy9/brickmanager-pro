
import React, { useState, useEffect } from 'react';
import { InventoryItem, Category, ItemCondition, ItemStatus } from '../types';
import { geminiService } from '../services/geminiService';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  initialItem?: InventoryItem | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, initialItem }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    category: Category.FURNITURE,
    condition: ItemCondition.GOOD,
    costPrice: 0,
    salePrice: 0,
    status: ItemStatus.AVAILABLE,
    description: '',
    acquiredFrom: ''
  });

  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setFormData(initialItem);
    } else {
      setFormData({
        name: '',
        category: Category.FURNITURE,
        condition: ItemCondition.GOOD,
        costPrice: 0,
        salePrice: 0,
        status: ItemStatus.AVAILABLE,
        description: '',
        acquiredFrom: ''
      });
    }
  }, [initialItem, isOpen]);

  const handleAiDescription = async () => {
    if (!formData.name) return;
    setAiLoading(true);
    try {
      const desc = await geminiService.generateListing({
        name: formData.name || '',
        condition: formData.condition || '',
        category: formData.category || ''
      });
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiPrice = async () => {
    if (!formData.name) return;
    setAiLoading(true);
    try {
      const suggestion = await geminiService.suggestPrice({
        name: formData.name || '',
        condition: formData.condition || ''
      });
      setFormData(prev => ({ ...prev, salePrice: suggestion.suggestedPrice }));
      alert(`IA Sugere: R$ ${suggestion.suggestedPrice}\nMotivo: ${suggestion.reasoning}`);
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{initialItem ? 'Editar Item' : 'Novo Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nome do Item</label>
              <input
                required
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Sofá 3 lugares azul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <select
                className="mt-1 w-full p-2 border rounded-lg"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Condição</label>
              <select
                className="mt-1 w-full p-2 border rounded-lg"
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
              >
                {Object.values(ItemCondition).map(cond => <option key={cond} value={cond}>{cond}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preço de Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full p-2 border rounded-lg"
                value={formData.costPrice}
                onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preço de Venda (R$)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 flex-1 p-2 border rounded-lg"
                  value={formData.salePrice}
                  onChange={e => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })}
                />
                <button 
                  type="button"
                  onClick={handleAiPrice}
                  className="mt-1 px-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  title="Sugerir preço com IA"
                  disabled={aiLoading}
                >
                  {aiLoading ? '...' : '🤖'}
                </button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Descrição / Anúncio</label>
                <button 
                  type="button"
                  onClick={handleAiDescription}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Gerando...' : '✨ Gerar anúncio com IA'}
                </button>
              </div>
              <textarea
                rows={4}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes sobre o estado, medidas, funcionamento..."
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Origem (Comprado de / Consignado)</label>
              <input
                className="mt-1 w-full p-2 border rounded-lg"
                value={formData.acquiredFrom}
                onChange={e => setFormData({ ...formData, acquiredFrom: e.target.value })}
                placeholder="Nome do antigo dono ou fornecedor"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
