import { Attribute, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';

class ApiMedicament extends jsonapi(Model) {
  static type: 'api-medicament' = 'api-medicament';

  public uid = '2-' + this.meta.id;

  @Attribute()
  denomination!: string;

  isMedicament() {
    return false;
  }
}

export default ApiMedicament;
