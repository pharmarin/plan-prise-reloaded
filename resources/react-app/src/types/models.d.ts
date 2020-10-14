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

type IExtractModel<T> = Exclude<T, 'attributes' | 'relationships'> &
  { [A in keyof T['attributes']]: A } &
  {
    [R in keyof T['relationships']]: IExtractModel<T['relationships'][R][0]>[];
  } & {
    relationshipNames: string[];
  };

declare namespace IModels {
  interface Medicament {
    id: string;
    type: 'medicament';
    attributes: {
      conservation_duree: { laboratoire: string; duree: string }[];
      conservation_frigo: boolean;
      denomination: string;
      indications: string[];
      voie_administration: number[];
    };
    relationships: {
      composition: PrincipeActif[];
      precautions: Precaution[];
    };
  }
  interface Precaution {
    id: string;
    type: 'precaution';
    attributes: {
      commentaire: string;
      population: string;
      voie_administration: number;
    };
  }
  interface PrincipeActif {
    id: string;
    type: 'principe-actif';
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
