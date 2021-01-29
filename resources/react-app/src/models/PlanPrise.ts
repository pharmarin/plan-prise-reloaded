import { Attribute, IRawModel, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';
import getConfig from 'helpers/get-config';
import { setWith, uniqueId } from 'lodash-es';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';

interface ICustomData {
  conservation_duree?: string;
  indications?: string[];
  posologies?: {
    [id: string]: string;
  };
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

interface ICustomSettings {
  posologies: {
    [id: string]: boolean;
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

  @Attribute()
  custom_settings!: ICustomSettings;

  addMedicament(medicament: Medicament | ApiMedicament) {
    this.medicaments.push(medicament);

    this.save();
  }

  removeMedicament(medicament: Medicament | ApiMedicament) {
    this.medicaments = this.medicaments.filter(
      (medicamentInArray) => medicamentInArray !== medicament
    );

    this.save();
  }

  setCustomSettings(key: string, value: any) {
    setWith(this.custom_settings, key, value);
  }

  getColumns() {
    const defaults = getConfig('default');
    const posologies = defaults?.posologies || [];

    return posologies.reduce((result: any, posologie) => {
      const custom = this.custom_settings.posologies?.[posologie.id];

      result[posologie.id] = {
        ...posologie,
        display: custom === undefined ? posologie.default || false : custom,
      };

      return result;
    }, {}) as { [id: string]: typeof posologies[0] & { display: boolean } };
  }

  setIndication(medicament: Medicament, indication: string) {
    setWith(
      this.custom_data,
      [medicament.uid, 'indications'],
      [indication],
      Object
    );
  }

  setConservationDuree(
    medicament: Medicament,
    laboratoire: string | undefined
  ) {
    setWith(
      this.custom_data,
      [medicament.uid, 'conservation_duree'],
      laboratoire,
      Object
    );
  }

  setPosologieValue(
    medicament: Medicament | ApiMedicament,
    posologieId: string,
    value: string
  ) {
    setWith(
      this.custom_data,
      [medicament.uid, 'posologies', posologieId],
      value,
      Object
    );
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
