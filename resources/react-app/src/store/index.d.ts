declare interface Tokens {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface Composition {
  id: string | number;
  denomination: string;
  precautions: number[];
}

interface MedicamentID {
  id: string;
  type: string;
  loading?: boolean;
}

interface Medicament extends MedicamentID {
  attributes: {
    compositions?: Composition[];
    denomination?: string;
  };
}

interface PlanPriseContent {
  id: number;
  custom_data: { [key: number]: { [key: string]: string } };
  custom_settings: { inputs: { [key: string]: { checked: boolean } } };
  medic_data: MedicamentID[];
}

interface CustomNotification {
  id: string;
  header?: string;
  content?: string;
  icon?: string;
  timer?: number;
}

declare namespace ReduxState {
  interface App {
    auth: {
      isError: boolean | string;
      isLoading: boolean;
      tokens: Tokens | null;
    };
    notifications: CustomNotification[];
    options?: {
      label: string;
      path: string;
    }[];
    returnTo?: {
      label: string;
      path: string;
    };
    title: string;
  }
  interface Cache {
    medicaments: Medicament[];
  }
  interface PlanPrise {
    id: number | null;
    content: null | 'loading' | 'error' | PlanPriseContent;
    list: null | 'loading' | 'error' | number[];
  }
}

declare interface ReduxState {
  app: ReduxState.App;
  cache: ReduxState.Cache;
  planPrise: ReduxState.PlanPrise;
}
