export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]).filter(Boolean))];
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
}; 