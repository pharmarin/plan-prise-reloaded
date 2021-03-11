import { Attribute, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';

class PrincipeActif extends jsonapi(Model) {
  static type = 'principe-actif';

  @Attribute()
  denomination!: string;
}

export default PrincipeActif;
