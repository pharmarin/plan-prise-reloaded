import { Attribute, Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';

class ApiMedicament extends jsonapi(Model) {
  static type = 'api-medicaments';

  @Attribute()
  denomination!: string;
}

export default ApiMedicament;
