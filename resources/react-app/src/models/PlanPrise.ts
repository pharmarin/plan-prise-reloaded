import { Model } from 'datx';
import { jsonapi } from 'datx-jsonapi';

class PlanPrise extends jsonapi(Model) {
  static type = 'plan-prises';
}

export default PlanPrise;
