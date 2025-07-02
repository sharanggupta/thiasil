export const getBaseCatalogNumber = (catNo) => {
  if (!catNo) return '';
  return catNo.split(/[/\s]/)[0];
}; 