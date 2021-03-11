import { Attribute, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';

class Precaution extends jsonapi(Model) {
  static type = 'precaution';

  @Attribute()
  commentaire!: string;

  @Attribute()
  population!: string;

  @Attribute()
  cible!: string;

  @Attribute()
  voie_administration!: number[];

  @Attribute({ defaultValue: false })
  checked!: boolean;
}

export default Precaution;
