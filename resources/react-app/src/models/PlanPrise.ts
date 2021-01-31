import { Attribute, IRawModel, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';
import getConfig from 'helpers/get-config';
import { setWith, uniqueId } from 'lodash-es';
import { computed } from 'mobx';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import forceArray from 'tools/force-array';

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

    return this.save();
  }

  removeMedicament(medicament: Medicament | ApiMedicament) {
    this.medicaments = this.medicaments.filter(
      (medicamentInArray) => medicamentInArray !== medicament
    );

    return this.save();
  }

  setCustomSettings(key: string, value: any) {
    setWith(this.custom_settings, key, value);
  }

  @computed
  get columns() {
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

  @computed
  getIndications(medicament: Medicament) {
    return forceArray(
      this.custom_data?.[medicament.uid]?.indications || medicament.indications
    );
  }

  setIndication(medicament: Medicament, indication: string) {
    setWith(
      this.custom_data,
      [medicament.uid, 'indications'],
      [indication],
      Object
    );
  }

  @computed
  getConservationDuree(medicament: Medicament) {
    const source = medicament?.conservation_duree || [];
    const custom = this.custom_data?.[medicament.uid]?.conservation_duree;

    const isCustom = typeof custom === 'string' && custom.length > 0;

    return {
      custom: isCustom,
      data:
        source.length === 1
          ? [source[0].duree]
          : isCustom
          ? [
              (source.find((i) => i.laboratoire === custom) || source[0]).duree,
            ] || []
          : source.map((i) => i.laboratoire) || [],
    } as {
      custom: boolean;
      data: string[];
    };
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

  @computed
  getPosologies(medicament: Medicament | ApiMedicament) {
    return Object.keys(this.columns)
      .filter((posologieID) => this.columns[posologieID].display)
      .map((posologieID) => ({
        ...this.columns[posologieID],
        value:
          this.custom_data[medicament.uid]?.posologies?.[posologieID] || '',
      }));
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

  @computed
  getPrecautions(medicament: Medicament | ApiMedicament) {
    return medicament.isMedicament()
      ? medicament.precautions.map((precaution) => {
          const customChecked = this.custom_data[medicament.uid]?.precautions?.[
            precaution.meta.id
          ]?.checked;
          return {
            ...precaution.toJSON(),
            id: precaution.meta.id,
            checked:
              customChecked !== undefined
                ? customChecked
                : precaution.population === undefined ||
                  precaution.population === '',
            commentaire:
              this.custom_data[medicament.uid]?.precautions?.[
                precaution.meta.id
              ]?.commentaire || precaution.commentaire,
          };
        })
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

  @computed
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
