declare interface IServerResponse<T> {
  data: T;
  links: any;
  meta: any;
}

declare namespace IModels {
  interface Medicament {
    type: 'medicament';
    id: string;
    attributes: {
      composition: { id: number; denomination: string }[];
      conservation_duree: { laboratoire: string; duree: string }[];
      conservation_frigo: boolean;
      denomination: string;
      indications: string[];
      precautions: {
        id: number;
        commentaire: string;
        population: string;
        voie_administration: number;
      };
      voie_administration: number[];
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
