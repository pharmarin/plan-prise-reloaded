declare namespace IRedux {
  interface App {
    navigation: {
      options?: {
        args?: any;
        label: string;
        path: string;
      }[];
      returnTo?: {
        label: string;
        path: string;
      };
      title: string;
    };
    notifications: Models.App.Notification[];
    showSettings: boolean;
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
