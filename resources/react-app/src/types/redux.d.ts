declare namespace Redux {
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
    options: {
      showSettings: boolean;
    };
  }
  export interface State {
    app: Redux.App;
    cache: Redux.Cache;
    planPrise: Redux.PlanPrise;
  }
}
