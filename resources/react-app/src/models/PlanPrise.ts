import { Attribute, IRawModel, Model, PureCollection } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';
import getConfig from 'helpers/get-config';
import { setWith, uniqueId } from 'lodash-es';
import { computed } from 'mobx';
import { computedFn } from 'mobx-utils';
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

    this.notifications = collection
      ? (collection as JsonApiStore).rootStore.notifications
      : undefined;
  }

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

  set customSettings({ key, value }: { key: string; value: any }) {
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
    this.custom_data = {
      ...setWith(
        this.custom_data,
        [medicament.uid, 'indications'],
        [indication],
        Object
      ),
    };
  }

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
    this.custom_data = {
      ...setWith(
        this.custom_data,
        [medicament.uid, 'conservation_duree'],
        laboratoire,
        Object
      ),
    };
  }

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
    this.custom_data = {
      ...setWith(
        this.custom_data,
        [medicament.uid, 'posologies', posologieId],
        value,
        Object
      ),
    };
  }

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
    this.custom_data = {
      ...setWith(
        this.custom_data,
        [medicament.uid, 'precautions', precaution.id, 'checked'],
        checked,
        Object
      ),
    };
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
    this.custom_data = {
      ...setWith(
        this.custom_data,
        [medicament.uid, 'precautions', precaution.id, 'commentaire'],
        value,
        Object
      ),
    };
  }

  customPrecautions = computedFn((medicament: Medicament | ApiMedicament) =>
    Object.entries(
      this.custom_data?.[medicament.uid]?.custom_precautions || {}
    ).map(([id, customPrecaution]) => ({ ...customPrecaution, id }))
  );

  addCustomPrecaution(medicament: Medicament | ApiMedicament) {
    this.custom_data = {
      ...setWith(
        this.custom_data,
        [
          medicament.uid,
          'custom_precautions',
          uniqueId('custom_precaution_'),
          'commentaire',
        ],
        '',
        Object
      ),
    };
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
    this.custom_data = {
      ...setWith(
        this.custom_data,
        [
          medicament.uid,
          'custom_precautions',
          customPrecaution.id,
          'commentaire',
        ],
        value,
        Object
      ),
    };
  }
}

export default PlanPrise;
