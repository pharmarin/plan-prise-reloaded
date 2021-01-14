import { Attribute, Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';

class Precaution extends jsonapi(Model) {
  static type = 'precautions';

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
