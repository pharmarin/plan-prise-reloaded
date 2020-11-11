export default (voie: number) => {
  switch (voie) {
    case 1:
      return 'Orale';
    case 2:
      return 'Cutanée';
    case 3:
      return 'Auriculaire';
    case 4:
      return 'Nasale';
    case 5:
      return 'Inhalée';
    case 6:
      return 'Vaginale';
    case 7:
      return 'Oculaire';
    case 8:
      return 'Rectale';
    case 9:
      return 'Sous-cutanée';
    case 10:
      return 'Intra-musculaire';
    case 11:
      return 'Intra-veineux';
    case 12:
      return 'Intra-urétrale';
    default:
      return 'Inconnue';
  }
};
