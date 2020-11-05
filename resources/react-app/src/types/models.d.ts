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
    [R in keyof T['relationships']]: ExtractModel<T['relationships'][R][0]>[];
  } & {
    relationshipNames: string[];
  };

type ExtractID<T> = Pick<T, 'id' | 'type'>;

type LoadingState = 'not-loaded' | 'loaded' | 'loading';

declare namespace Models {
  declare namespace App {
    interface Notification {
      id: string;
      header?: string;
      content?: string;
      icon?: string;
      timer?: number;
    }
    interface Tokens {
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }
    interface User {
      [key: string]: string | undefined;
      admin: boolean;
      name: string;
      display_name?: string;
      email: string;
    }
  }
  interface ApiMedicament extends MedicamentIdentity {
    type: 'api-medicaments';
    attributes: {
      denomination: string;
    };
  }
  interface Medicament extends MedicamentIdentity {
    type: 'medicaments';
    attributes: {
      conservation_duree: { laboratoire: string; duree: string }[];
      conservation_frigo: boolean;
      denomination: string;
      indications: string[];
      voies_administration: number[];
    };
    relationships: {
      bdpm: ApiMedicament[];
      composition: PrincipeActif[];
      precautions: Precaution[];
    };
  }
  interface MedicamentIdentity {
    id: string;
    type: ApiMedicament['type'] | Medicament['type'];
  }
  interface MedicamentIdentityWithLoading extends MedicamentIdentity {
    loading?: boolean;
  }
  interface PlanPrise {
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
      medicaments: MedicamentIdentityWithLoading[];
    };
  }
  interface Precaution {
    id: string;
    type: 'precautions';
    attributes: {
      commentaire: string;
      population: string;
      voie_administration: number;
    };
  }
  interface PrincipeActif {
    id: string;
    type: 'principe-actifs';
    attributes: {
      denomination: string;
    };
  }
}
