import { Attribute, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';
import ApiMedicament from 'models/ApiMedicament';
import Precaution from 'models/Precaution';
import PrincipeActif from 'models/PrincipeActif';

class Medicament extends jsonapi(Model) {
  static type: 'medicament' = 'medicament';

  public uid = '1-' + this.meta.id;

  @Attribute()
  denomination!: string;

  @Attribute()
  indications!: string[];

  @Attribute()
  voies_administration!: number[];

  @Attribute()
  conservation_frigo!: boolean;

  @Attribute()
  conservation_duree!: { laboratoire?: string; duree: string }[];

  @Attribute({ toMany: PrincipeActif.type })
  composition!: PrincipeActif[];

  @Attribute({ toMany: Precaution.type })
  precautions!: Precaution[];

  @Attribute({ toMany: ApiMedicament.type })
  bdpm!: ApiMedicament[];

  public isMedicament(): this is Medicament {
    return true;
  }
}

export default Medicament;
