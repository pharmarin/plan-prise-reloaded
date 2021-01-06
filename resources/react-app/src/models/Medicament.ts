import { Attribute, Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';
import ApiMedicament from './ApiMedicament';
import Precaution from './Precaution';
import PrincipeActif from './PrincipeActif';

class Medicament extends jsonapi(Model) {
  static type = 'medicaments';

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
}

export default Medicament;
