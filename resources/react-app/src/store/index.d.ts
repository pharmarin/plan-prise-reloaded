declare interface ITokens {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface IComposition {
  id: string | number;
  denomination: string;
  precautions: number[];
}

interface ICustomNotification {
  id: string;
  header?: string;
  content?: string;
  icon?: string;
  timer?: number;
}

interface IMedicamentID {
  id: string;
  type: string;
  loading?: boolean;
}

interface IMedicament extends IMedicamentID {
  attributes: {
    compositions?: IComposition[];
    denomination?: string;
    voies_administration?: number[];
  };
}

interface IMedicamentRepository {
  id: string;
  type: string;
  data: {
    denomination: string;
    compositions: string[];
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
  id: IPlanPriseID;
  status: IPlanPriseStatus | 'loaded' | 'not-loaded';
  data?: IMedicamentRepository[];
}

type IPlanPriseStatus = 'loading' | 'error' | 'deleting' | 'deleted';

interface IPrecaution {
  id: string;
  commentaire: string;
  population: string;
}

declare namespace IReduxState {
  interface App {
    auth: {
      isError: boolean | string;
      isLoading: boolean;
      tokens: ITokens | null;
    };
    notifications: ICustomNotification[];
    options?: {
      label: string;
      path: string;
    }[];
    returnTo?: {
      label: string;
      path: string;
    };
    showSettings: boolean;
    title: string;
  }
  interface Cache {
    medicaments: IMedicament[];
  }
  interface PlanPrise {
    id: number | null;
    content: null | IPlanPriseStatus | IPlanPriseContent;
    list: null | 'loading' | 'error' | number[];
  }
}

declare interface IReduxState {
  app: IReduxState.App;
  cache: IReduxState.Cache;
  planPrise: IReduxState.PlanPrise;
}
