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

interface Medicament {
  id: number;
  type: string;
  compositions?: Composition[];
  custom_denomination?: string;
}

declare namespace ReduxState {
  interface App {
    title: string;
    return: {
      label: string;
      path: string;
    } | null;
    auth: {
      isError: boolean | string;
      isLoading: boolean;
      tokens: Tokens | null;
    };
  }
  interface Data {
    medicaments: Medicament[];
  }
  interface PlanPrise {
    id: number | null;
    content:
      | null
      | 'loading'
      | 'error'
      | {
          created_at: string;
          custom_data: { [number]: { [string]: string } };
          custom_settings: {};
          deleted_at: string | null;
          id: number;
          medicaments: Medicament[];
          pp_id: number;
          updated_at: string;
          user_id: number;
        };
    list: null | 'loading' | 'error' | number[];
  }
}

declare interface ReduxState {
  app: ReduxState.App;
  data: any;
  planPrise: ReduxState.PlanPrise;
}
