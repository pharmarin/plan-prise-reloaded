declare interface IServerResponse<T> {
  data: T;
  links: {
    first: string;
    last: string;
    next: string;
  };
  meta: {
    page: {
      'current-page': number;
      from: number;
      'last-page': number;
      'per-page': number;
      to: number;
      total: number;
    };
  };
}

type ExtractModel<T> = Omit<T, 'attributes' | 'relationships'> &
  { [A in keyof T['attributes']]: T['attributes'][A] } &
  {
    [R in keyof T['relationships']]: ExtractModel<
      T['relationships'][R]['data'][0]
    >[];
  } & {
    relationshipNames: string[];
  };

type ExtractID<T> = Pick<T, 'id' | 'type'>;

type LoadingState = 'not-loaded' | 'loaded' | 'loading';

declare namespace Models {
  namespace App {
    type Config = {
      version: string;
      validation: {
        [key: string]: string;
      };
      default: {
        posologies: [
          {
            id: string;
            label: string;
            default?: boolean;
            color: string;
          }
        ];
      };
    } | null;
    interface Notification {
      id: string;
      header?: string;
      content?: string;
      icon?: string;
      timer?: number;
    }
    interface User {
      [key: string]: string | undefined;
      admin: boolean;
      name: string;
      display_name?: string;
      email: string;
    }
  }
  namespace ApiMedicament {
    interface Entity extends MedicamentIdentity {
      type: 'api-medicaments';
      attributes: {
        denomination: string;
      };
    }
    type Extracted = ExtractModel<ApiMedicament.Entity>;
  }
  namespace Medicament {
    interface Entity extends MedicamentIdentity {
      type: 'medicaments';
      attributes: {
        conservation_duree: { laboratoire: string; duree: string }[];
        conservation_frigo: boolean;
        denomination: string;
        indications: string[];
        voies_administration: number[];
      };
      relationships: {
        bdpm: { data: ApiMedicament.Entity[] };
        composition: { data: PrincipeActif.Entity[] };
        precautions: { data: Precaution.Entity[] };
      };
    }
    type Extracted = ExtractModel<Medicament.Entity>;
  }
  interface MedicamentIdentity extends ResourceObject {
    id: string;
    type: ApiMedicament['type'] | Medicament['type'];
  }
  interface MedicamentIdentityWithLoading extends MedicamentIdentity {
    loading?: boolean;
  }
  namespace PlanPrise {
    interface Entity {
      id: string;
      type: 'plan-prises';
      attributes: {
        custom_data: {
          [id: string]: {
            [field: string]: string;
          };
        };
        custom_settings: {
          inputs: {
            [inputName: string]: {
              checked: boolean;
            };
          };
        };
      };
      relationships: {
        medicaments: { data: MedicamentIdentityWithLoading[] };
      };
    }
    type Extracted = ExtractModel<PlanPrise.Entity>;
  }
  interface Posologie {
    // TODO: Delte
    id: string;
    label: string;
    default?: boolean;
    color: string;
  }
  namespace Precaution {
    interface Entity {
      id: string;
      type: 'precautions';
      attributes: {
        commentaire: string;
        population: string;
        voie_administration: number;
      };
    }
    type Extracted = ExtractModel<Precaution.Entity>;
  }
  namespace PrincipeActif {
    interface Entity {
      id: string;
      type: 'principe-actifs';
      attributes: {
        denomination: string;
      };
    }
    type Extracted = ExtractModel<PrincipeActif.Entity>;
  }
}
