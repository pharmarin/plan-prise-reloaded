import { Attribute, Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import forceArray from 'utility/force-array';

class PlanPrise extends jsonapi(Model) {
  static type = 'plan-prises';

  @Attribute({
    toMany: (data: any) =>
      data && data?.type === 'api-medicaments' ? ApiMedicament : Medicament,
  })
  medicaments!: (Medicament | ApiMedicament)[];

  @Attribute()
  custom_data!: {
    conservation_duree?: string;
    indications?: string[];
  };

  getIndications(medicament: Medicament) {
    const source = medicament.indications;
    const custom = this.custom_data.indications;

    return forceArray(custom || source);
  }

  getConservationDuree(medicament: Medicament) {
    const source = medicament.conservation_duree;
    const custom = this.custom_data.conservation_duree;

    const isCustomValue = custom !== null && custom !== undefined;

    return {
      custom: isCustomValue,
      data:
        source.length === 1
          ? [source[0].duree]
          : custom
          ? [
              (source.find((i) => i.laboratoire === custom) || source[0]).duree,
            ] || []
          : source.map((i) => i.laboratoire) || [],
    };
  }

  getPrecautions(medicament: Medicament | ApiMedicament) {
    return medicament.isMedicament() ? medicament.precautions : [];
  }

  getCustomPrecautions(medicament: Medicament | ApiMedicament) {
    return [];
  }
}

export default PlanPrise;
