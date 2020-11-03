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

type IExtractModel<T> = Omit<T, 'attributes' | 'relationships'> &
  { [A in keyof T['attributes']]: T['attributes'][A] } &
  {
    [R in keyof T['relationships']]: IExtractModel<T['relationships'][R][0]>[];
  } & {
    relationshipNames: string[];
  };

type IExtractID<T> = Pick<T, 'id' | 'type'>;

declare namespace IModels {
  interface Medicament {
    id: string;
    type: 'medicaments';
    attributes: {
      conservation_duree: { laboratoire: string; duree: string }[];
      conservation_frigo: boolean;
      denomination: string;
      indications: string[];
      voies_administration: number[];
    };
    relationships: {
      bdpm: BDPM[];
      composition: PrincipeActif[];
      precautions: Precaution[];
    };
  }
  interface BDPM {
    id: string;
    type: 'api-medicaments';
    attributes: {
      denomination: string;
    };
  }
  interface PlanPrise {
    id: string;
    type: 'plan-prises';
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
  interface User {
    [key: string]: string | undefined;
    admin: boolean;
    name: string;
    display_name?: string;
    email: string;
  }
}
