declare namespace Redux {
  interface App {
    notifications: Models.App.Notification[];
  }
  interface Cache {
    medicaments: (
      | Models.Medicament.Extracted
      | Models.ApiMedicament.Extracted
    )[];
  }
  interface PlanPrise {
    list: {
      status: LoadingState;
      data?: Models.PlanPrise.Entity['id'][];
    };
    content: {
      status: LoadingState | 'deleted' | 'deleting' | 'creating';
      data?: Models.PlanPrise.Extracted;
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
