declare namespace IRedux {
  interface App {
    auth: {
      isError: boolean | string;
      isLoading: boolean;
      tokens: Models.Tokens | null;
    };
    notifications: Models.App.Notification[];
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
    medicaments: (
      | ExtractModel<Models.Medicament>
      | ExtractModel<Models.ApiMedicament>
    )[];
  }
  interface PlanPrise {
    list: {
      status: LoadingState;
      data?: Models.PlanPrise['id'][];
    };
    content: {
      status: LoadingState | 'deleted' | 'deleting' | 'creating';
      data?: ExtractModel<Models.PlanPrise>;
    };
  }
  export interface State {
    app: IRedux.App;
    cache: IRedux.Cache;
    planPrise: IRedux.PlanPrise;
  }
}
