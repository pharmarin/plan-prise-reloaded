import { Attribute, Model } from '@datx/core';
import ApiMedicament from './ApiMedicament';
import Medicament from './Medicament';

class Calendar extends Model {
  static type = 'calendars';

  @Attribute({
    toMany: (data: any) =>
      data && data?.type === 'api-medicaments' ? ApiMedicament : Medicament,
  })
  medicaments?: (Medicament | ApiMedicament)[];

  @Attribute({})
  recurrences?: { recurrence?: number; quantity: number }[];

  addMedicament(medicament: Medicament | ApiMedicament) {
    (this.medicaments || []).push(medicament);
    console.log('this.medicaments: ', this.medicaments);

    //return this.save();
  }
}

export default Calendar;
