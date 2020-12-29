import { Collection } from 'datx';
import { config, jsonapi } from 'datx-jsonapi';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import Precaution from 'models/Precaution';
import PrincipeActif from 'models/PrincipeActif';

config.baseUrl = 'http://localhost:3000/api/v1/';

class JsonApiStore extends jsonapi(Collection) {
  static types = [ApiMedicament, Medicament, Precaution, PrincipeActif];
}

export default JsonApiStore;
