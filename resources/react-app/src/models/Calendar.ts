import { Attribute, IRawModel, Model, PureCollection } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';
import { action, computed, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import JsonApiStore from 'store/json-api';
import { mutate } from 'swr';
import ApiMedicament from './ApiMedicament';
import Medicament from './Medicament';

type TRecurrence = { recurrence?: number; quantity: number };

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
  recurrences?: { [uid: string]: TRecurrence[] };

  /**
   * Adds medicament to the medic_data array and saves the calendar
   * @param medicament Medicament to add in the medic_data array
   * @returns Promise: save()
   */
  addMedicament(medicament: Medicament | ApiMedicament) {
    (this.medicaments || []).push(medicament);

    return this.save();
  }

  secureRecurrencesFor = action(
    /**
     * Creates and adds default recurrence for the medicament passed as parameter
     * @param medicament Medicament to add default recurrency for
     */
    (medicament: Medicament | ApiMedicament) => {
      if (!this.recurrences) {
        this.recurrences = {};
      }
      if ((this.recurrences?.[medicament.uid] || []).length === 0) {
        this.recurrences[medicament.uid] = [
          {
            quantity: 1,
          },
        ];
      }
    }
  );

  @computed
  recurrencesFor = computedFn(
    /**
     * Get the recurrences for the medicament passed as parameter
     * @param medicament Medicament to get recurrences for
     * @returns Array of recurrences for the medicament or an array with a default recurrence
     */
    (medicament: Medicament | ApiMedicament) => {
      this.secureRecurrencesFor(medicament);

      return this.recurrences![medicament.uid];
    }
  );

  /**
   * Adds a default recurrence at the index passed as parameter
   * @param index index in recurrences array
   * @param medicament medicament of the recurrence
   */
  addRecurrenceAtIndex(index: number, medicament: Medicament | ApiMedicament) {
    this.secureRecurrencesFor(medicament);

    this.recurrences![medicament.uid].splice(index, 0, {
      quantity: 1,
    });
  }
}

export default Calendar;
