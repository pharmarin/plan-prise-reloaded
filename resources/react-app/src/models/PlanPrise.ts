import {
  Attribute,
  IRawModel,
  isAttributeDirty,
  Model,
  PureCollection,
} from '@datx/core';
import { jsonapi } from '@datx/jsonapi';
import debounce from 'debounce-promise';
import getConfig from 'helpers/get-config';
import { setWith, uniqueId } from 'lodash-es';
import { computed, reaction, toJS } from 'mobx';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import JsonApiStore from 'store/json-api';
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
  notifications;

  static type = 'plan-prises';

  constructor(data?: IRawModel, collection?: PureCollection) {
    super(data, collection);

    this.notifications = (collection as JsonApiStore)?.rootStore?.notifications;

    reaction(
      () => toJS(this.custom_data),
      (custom_data, previousValue, reaction) => {
        console.log(
          'change',
          toJS(custom_data),
          toJS(previousValue),
          isAttributeDirty(this, 'custom_data')
        );

        if (!isAttributeDirty(this, 'custom_data')) return;

        if (JSON.stringify(custom_data) === JSON.stringify(previousValue))
          return;

        this.debouncedSave();
      }
    );
  }

  debouncedSave = debounce(this.save, 2000);

  @Attribute({
    toMany: (data: any) =>
      data && data?.type === 'api-medicaments' ? ApiMedicament : Medicament,
  })
  medicaments!: (Medicament | ApiMedicament)[];

  @Attribute()
  custom_data!: {
    [uid: string]: ICustomData;
  };

  setCustomData(path: string[], value: any) {
    this.assign(
      'custom_data',
      setWith(toJS(this.custom_data), path, value, Object)
    );
  }

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
    this.custom_settings = { ...setWith(this.custom_settings, key, value) };
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
    this.setCustomData([medicament.uid, 'indications'], [indication]);
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
    this.setCustomData([medicament.uid, 'conservation_duree'], laboratoire);
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
    this.setCustomData([medicament.uid, 'posologies', posologieId], value);
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
    this.setCustomData(
      [medicament.uid, 'precautions', precaution.id, 'checked'],
      checked
    );
  }

  setPrecautionCommentaire(
    medicament: Medicament,
    precaution: IRawModel,
    value: string
  ) {
    this.setCustomData(
      [medicament.uid, 'precautions', precaution.id, 'commentaire'],
      value
    );
  }

  @computed
  getCustomPrecautions(medicament: Medicament | ApiMedicament) {
    return Object.entries(
      this.custom_data?.[medicament.uid]?.custom_precautions || {}
    ).map(([id, customPrecaution]) => ({ ...customPrecaution, id }));
  }

  addCustomPrecaution(medicament: Medicament | ApiMedicament) {
    this.setCustomData(
      [
        medicament.uid,
        'custom_precautions',
        uniqueId('custom_precaution_'),
        'commentaire',
      ],
      ''
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
    this.setCustomData(
      [
        medicament.uid,
        'custom_precautions',
        customPrecaution.id,
        'commentaire',
      ],
      value
    );
  }
}

export default PlanPrise;
