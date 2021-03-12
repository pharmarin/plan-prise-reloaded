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
    interface Config {
      version: string;
      validation: {
        [key: string]: string;
      };
      default: {
        posologies: {
          id: string;
          label: string;
          default?: boolean;
          color: string;
        }[];
        voies_administration: {
          [id: number]: string;
        };
      };
    }
    interface User {
      id: string;
      type: 'user';
      attributes: {
        admin: boolean;
        first_name: string;
        last_name: string;
        name: string;
        display_name?: string;
        email: string;
        rpps?: string;
        status: 'student' | 'pharmacist';
        created_at: string;
      };
    }
  }
  namespace Medicament {
    interface Entity extends MedicamentIdentity {
      type: 'medicament';
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
  interface MedicamentIdentity {
    id: string;
    type: ApiMedicament['type'] | Medicament['type'];
  }
  interface MedicamentIdentityWithLoading extends MedicamentIdentity {
    loading?: boolean;
  }
}
