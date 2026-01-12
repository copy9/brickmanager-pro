
export enum ItemStatus {
  AVAILABLE = 'Disponível',
  SOLD = 'Vendido',
  REPAIR = 'Manutenção',
  RESERVED = 'Reservado'
}

export enum ItemCondition {
  NEW = 'Novo',
  EXCELLENT = 'Excelente',
  GOOD = 'Bom',
  FAIR = 'Regular',
  POOR = 'Ruim'
}

export enum Category {
  FURNITURE = 'Móveis',
  ELECTRONICS = 'Eletrônicos',
  APPLIANCES = 'Eletrodomésticos',
  DECOR = 'Decoração',
  OTHER = 'Outros'
}

export enum ExpenseCategory {
  RENT = 'Aluguel',
  FREIGHT = 'Frete',
  TOOLS = 'Ferramentas',
  UTILITIES = 'Contas (Luz/Água)',
  MARKETING = 'Marketing/Anúncios',
  MAINTENANCE = 'Manutenção/Peças',
  OTHER = 'Outros'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  condition: ItemCondition;
  costPrice: number;
  salePrice: number;
  status: ItemStatus;
  description: string;
  dateAdded: string;
  acquiredFrom: string;
}

export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  saleDate: string;
  saleAmount: number;
  paymentMethod: 'Dinheiro' | 'PIX' | 'Cartão' | 'Outro';
  profit: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}
