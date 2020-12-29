import { Attribute, Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';

class PrincipeActif extends jsonapi(Model) {
  static type = 'principe-actifs';

  @Attribute()
  denomination!: string;
}

export default PrincipeActif;
