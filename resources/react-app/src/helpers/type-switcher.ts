export const typeToInt = (type: string) => {
  switch (type) {
    case 'old-medicament':
      return 0;
    case 'medicament':
      return 1;
    case 'api-medicament':
      return 2;
    default:
      throw new Error('Type not allowed');
  }
};
