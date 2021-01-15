import { Attribute, IRawModel, Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';
import { setWith, uniqueId } from 'lodash-es';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import forceArray from 'utility/force-array';

interface ICustomData {
  conservation_duree?: string;
  indications?: string[];
  precautions?: {
    [uid: string]: {
      checked?: boolean;
      commentaire?: string;
    };
  };
  custom_precautions?: {
    [uid: string]: {
      commentaire?: string;
    };
  };
}

class PlanPrise extends jsonapi(Model) {
  static type = 'plan-prises';

  @Attribute({
    toMany: (data: any) =>
      data && data?.type === 'api-medicaments' ? ApiMedicament : Medicament,
  })
  medicaments!: (Medicament | ApiMedicament)[];

  @Attribute()
  custom_data!: {
    [uid: string]: ICustomData;
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
    return medicament.isMedicament()
      ? medicament.precautions.map((precaution) => ({
          ...precaution.toJSON(),
          id: precaution.meta.id,
          checked:
            this.custom_data[medicament.uid]?.precautions?.[precaution.meta.id]
              ?.checked || false, // TODO: Ajouter la valeur du boolean en fonction de la population
          commentaire:
            this.custom_data[medicament.uid]?.precautions?.[precaution.meta.id]
              ?.commentaire || precaution.commentaire,
        }))
      : [];
  }

  setPrecautionChecked(
    medicament: Medicament,
    precaution: IRawModel,
    checked: boolean
  ) {
    setWith(
      this.custom_data,
      [medicament.uid, 'precautions', precaution.id, 'checked'],
      checked,
      Object
    );
  }

  setPrecautionCommentaire(
    medicament: Medicament,
    precaution: IRawModel,
    value: string
  ) {
    setWith(
      this.custom_data,
      [medicament.uid, 'precautions', precaution.id, 'commentaire'],
      value,
      Object
    );
  }

  getCustomPrecautions(medicament: Medicament | ApiMedicament) {
    return Object.entries(
      this.custom_data?.[medicament.uid]?.custom_precautions || {}
    ).map(([id, customPrecaution]) => ({ ...customPrecaution, id }));
  }

  addCustomPrecaution(medicament: Medicament | ApiMedicament) {
    setWith(
      this.custom_data,
      [
        medicament.uid,
        'custom_precautions',
        uniqueId('custom_precaution_'),
        'commentaire',
      ],
      '',
      Object
    );
  }

  removeCustomPrecaution(
    medicament: Medicament | ApiMedicament,
    customPrecaution: IRawModel
  ) {
    delete this.custom_data[medicament.uid]?.custom_precautions?.[
      customPrecaution.id
    ];
  }

  setCustomPrecautionCommentaire(
    medicament: Medicament | ApiMedicament,
    customPrecaution: IRawModel,
    value: string
  ) {
    setWith(
      this.custom_data,
      [
        medicament.uid,
        'custom_precautions',
        customPrecaution.id,
        'commentaire',
      ],
      value,
      Object
    );
  }
}

export default PlanPrise;
