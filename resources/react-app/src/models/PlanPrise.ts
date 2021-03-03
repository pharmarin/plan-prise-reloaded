import {
  Attribute,
  IRawModel,
  isAttributeDirty,
  Model,
  PureCollection
} from '@datx/core';
import { IRequestOptions, jsonapi } from '@datx/jsonapi';
import debounce from 'debounce-promise';
import getConfig from 'helpers/get-config';
import { isPlainObject, setWith, uniqueId } from 'lodash-es';
import { computed, reaction, toJS } from 'mobx';
import { computedFn } from 'mobx-utils';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import JsonApiStore from 'store/json-api';
import { mutate } from 'swr';
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
      () => this.meta.id,
      (id, previousID) => {
        if (id > 0 && previousID < 0) {
          mutate('plan-prise/list');
        }
      }
    );

    reaction(
      () => toJS(this.custom_data),
      (custom_data, previousValue) => {
        if (!isAttributeDirty(this, 'custom_data')) return;

        if (JSON.stringify(custom_data) === JSON.stringify(previousValue))
          return;

        debounce(this.savePlanPrise, 2000)();
      }
    );

    reaction(
      () => toJS(this.custom_settings),
      (custom_settings, previousValue) => {
        if (!isAttributeDirty(this, 'custom_settings')) return;

        if (JSON.stringify(custom_settings) === JSON.stringify(previousValue))
          return;

        this.savePlanPrise();
      }
    );
  }

  savePlanPrise = async (options?: IRequestOptions | undefined) => {
    const notification = this.notifications.addNotification({
      title: 'Sauvegarde en cours',
      type: 'loading',
    });

    await this.save(options);

    this.notifications.removeOne(notification);
  };

  @Attribute({
    toMany: (data: any) =>
      data && data?.type === 'api-medicaments' ? ApiMedicament : Medicament,
  })
  medicaments!: (Medicament | ApiMedicament)[];

  @Attribute({
    defaultValue: {},
  })
  custom_data!: {
    [uid: string]: ICustomData;
  };

  setCustomData(path: string[], value: any) {
    if (!isPlainObject(this.custom_data[path[0]]))
      this.custom_data[path[0]] = {}; // Fix #53

    this.assign(
      'custom_data',
      setWith(toJS(this.custom_data), path, value, Object)
    );
  }

  @Attribute({
    defaultValue: {},
  })
  custom_settings!: ICustomSettings;

  addMedicament(medicament: Medicament | ApiMedicament) {
    if (!this.medicaments) {
      this.medicaments = [];
    }

    this.medicaments.push(medicament);

    return this.save();
  }

  removeMedicament(medicament: Medicament | ApiMedicament) {
    this.medicaments = this.medicaments.filter(
      (medicamentInArray) => medicamentInArray !== medicament
    );

    return this.save();
  }

  set customSettings({ key, value }: { key: string; value: any }) {
    this.assign(
      'custom_settings',
      setWith(toJS(this.custom_settings), key, value, Object)
    );
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
  indications = computedFn((medicament: Medicament) =>
    forceArray(
      this.custom_data?.[medicament.uid]?.indications || medicament.indications
    )
  );

  set indication({
    indication,
    medicament,
  }: {
    medicament: Medicament;
    indication: string;
  }) {
    this.setCustomData([medicament.uid, 'indications'], [indication]);
  }

  @computed
  conservationsDuree = computedFn((medicament: Medicament) => {
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
  });

  set conservationDuree({
    laboratoire,
    medicament,
  }: {
    medicament: Medicament;
    laboratoire: string | undefined;
  }) {
    this.setCustomData([medicament.uid, 'conservation_duree'], laboratoire);
  }

  @computed
  posologies = computedFn((medicament: Medicament | ApiMedicament) =>
    Object.keys(this.columns)
      .filter((posologieID) => this.columns[posologieID].display)
      .map((posologieID) => ({
        ...this.columns[posologieID],
        value:
          this.custom_data[medicament.uid]?.posologies?.[posologieID] || '',
      }))
  );

  set posologie({
    medicament,
    posologieId,
    value,
  }: {
    medicament: Medicament | ApiMedicament;
    posologieId: string;
    value: string;
  }) {
    this.setCustomData([medicament.uid, 'posologies', posologieId], value);
  }

  @computed
  precautions = computedFn((medicament: Medicament | ApiMedicament) =>
    medicament.isMedicament()
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
      : []
  );

  set precautionChecked({
    checked,
    medicament,
    precaution,
  }: {
    medicament: Medicament;
    precaution: IRawModel;
    checked: boolean;
  }) {
    this.setCustomData(
      [medicament.uid, 'precautions', precaution.id, 'checked'],
      checked
    );
  }

  set precautionCommentaire({
    medicament,
    precaution,
    value,
  }: {
    medicament: Medicament;
    precaution: IRawModel;
    value: string;
  }) {
    this.setCustomData(
      [medicament.uid, 'precautions', precaution.id, 'commentaire'],
      value
    );
  }

  @computed
  customPrecautions = computedFn((medicament: Medicament | ApiMedicament) =>
    Object.entries(
      this.custom_data?.[medicament.uid]?.custom_precautions || {}
    ).map(([id, customPrecaution]) => ({ ...customPrecaution, id }))
  );

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

  set customPrecautionCommentaire({
    customPrecaution,
    medicament,
    value,
  }: {
    medicament: Medicament | ApiMedicament;
    customPrecaution: IRawModel;
    value: string;
  }) {
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
