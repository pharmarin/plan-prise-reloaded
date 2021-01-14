import { Attribute, Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';
import ApiMedicament from 'models/ApiMedicament';
import Precaution from 'models/Precaution';
import PrincipeActif from 'models/PrincipeActif';

class Medicament extends jsonapi(Model) {
  static type = 'medicaments';

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

  @Attribute({ toMany: 'principe-actifs' })
  composition!: PrincipeActif[];

  @Attribute({ toMany: 'precautions' })
  precautions!: Precaution[];

  @Attribute({ toMany: 'api-medicaments' })
  bdpm!: ApiMedicament[];

  public isMedicament(): this is Medicament {
    return true;
  }
}

export default Medicament;
