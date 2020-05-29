declare interface Tokens {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
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
  interface PlanPrise {
    id: number | null;
    list: null | 'loading' | 'error' | number[];
  }
}

declare interface ReduxState {
  app: ReduxState.App;
  data: any;
  planPrise: any;
}
