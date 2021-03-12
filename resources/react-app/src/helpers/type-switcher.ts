import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';

export const typeToInt = (type: string) => {
  switch (type) {
    case Medicament.type:
      return 1;
    case ApiMedicament.type:
      return 2;
    default:
      throw new Error('Type not allowed');
  }
};
