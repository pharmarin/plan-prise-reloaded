export const typeToInt = (type: string) => {
  switch (type) {
    case 'medicaments':
      return 1;
    case 'api-medicaments':
      return 2;
    default:
      throw new Error('Type not allowed');
  }
};
