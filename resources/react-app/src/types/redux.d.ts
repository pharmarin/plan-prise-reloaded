declare namespace IRedux {
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
  export interface State {
    app: IRedux.App;
    cache: IRedux.Cache;
    planPrise: IRedux.PlanPrise;
  }
}
