import { STOCK_STATUSES } from './constants';

export type StockStatus = 'in_stock' | 'out_of_stock' | 'made_to_order' | 'limited_stock';

export interface StockStatusConfig {
  label: string;
  bg: string;
  color: string;
}

export const getStockStatusConfig = (status: StockStatus | string): StockStatusConfig => {
  const statusMap: Record<string, StockStatusConfig> = {
    'in_stock': STOCK_STATUSES.IN_STOCK,
    'out_of_stock': STOCK_STATUSES.OUT_OF_STOCK,
    'made_to_order': STOCK_STATUSES.MADE_TO_ORDER,
    'limited_stock': STOCK_STATUSES.LIMITED_STOCK,
  };
  return statusMap[status] || STOCK_STATUSES.IN_STOCK;
};

export const getStockStatusDisplay = (status: StockStatus | string): { label: string; className: string } => {
  const config = getStockStatusConfig(status);
  return {
    label: config.label,
    className: `${config.bg} ${config.color}`,
  };
}; 