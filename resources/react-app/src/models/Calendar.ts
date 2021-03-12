import { Attribute, IRawModel, Model, PureCollection } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';
import { reaction } from 'mobx';
import JsonApiStore from 'store/json-api';
import { mutate } from 'swr';
import ApiMedicament from './ApiMedicament';
import Medicament from './Medicament';

class Calendar extends jsonapi(Model) {
  static type = 'calendar';
  private notifications;

  constructor(data?: IRawModel, collection?: PureCollection) {
    super(data, collection);

    this.notifications = (collection as JsonApiStore)?.rootStore?.notifications;

    reaction(
      () => this.meta.id,
      (id, previousID) => {
        if (id > 0 && previousID < 0) {
          mutate('calendar/list');
        }
      }
    );
  }

  @Attribute({
    toMany: (data: any) =>
      data && data?.type === ApiMedicament.type ? ApiMedicament : Medicament,
  })
  medicaments?: (Medicament | ApiMedicament)[];

  @Attribute({})
  recurrences?: { recurrence?: number; quantity: number }[];

  addMedicament(medicament: Medicament | ApiMedicament) {
    (this.medicaments || []).push(medicament);

    return this.save();
  }
}

export default Calendar;
