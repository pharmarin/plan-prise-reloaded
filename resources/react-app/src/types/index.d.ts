declare interface ITokens {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface IComposition {
  id: number;
  denomination: string;
}

interface ICustomNotification {
  id: string;
  header?: string;
  content?: string;
  icon?: string;
  timer?: number;
}

interface IMedicamentRepository {
  id: string;
  type: string;
  data: {
    denomination: string;
    composition: string[];
  };
  attributes: {
    conservation_frigo: boolean;
    conservation_duree: {
      custom: boolean;
      data: string[] | string;
    };
    custom_precautions: Omit<IPrecaution, 'population'>[];
    indications: string[];
    posologies: Record<string, { id: string; label: string; value: string }>;
    precautions: (IPrecaution & { checked: boolean })[];
    voies_administration: string[];
  };
}

type IPlanPriseID = number;

interface IPlanPriseContent {
  id: IPlanPriseID;
  custom_data: { [key: number]: { [key: string]: string } };
  custom_settings: { inputs?: { [key: string]: { checked: boolean } } };
  medic_data: IMedicamentID[];
}

interface IPlanPriseRepository {
  id: IModels.PlanPrise['id'] | undefined;
  status: IRedux.State['planPrise']['content']['status'];
  data?: IMedicamentRepository[];
}

type IPlanPriseStatus = 'loading' | 'deleting' | 'deleted';

interface IPrecaution {
  id: string;
  commentaire: string;
  population: string;
}
