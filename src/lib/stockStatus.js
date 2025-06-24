import { STOCK_STATUSES } from './constants';

export const getStockStatusConfig = (status) => {
  const statusMap = {
    'in_stock': STOCK_STATUSES.IN_STOCK,
    'out_of_stock': STOCK_STATUSES.OUT_OF_STOCK,
    'made_to_order': STOCK_STATUSES.MADE_TO_ORDER,
    'limited_stock': STOCK_STATUSES.LIMITED_STOCK,
  };
  return statusMap[status] || STOCK_STATUSES.IN_STOCK;
};

export const getStockStatusDisplay = (status) => {
  const config = getStockStatusConfig(status);
  return {
    label: config.label,
    className: `${config.bg} ${config.color}`,
  };
}; 