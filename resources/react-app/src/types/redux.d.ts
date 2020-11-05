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
    medicaments: (
      | IExtractModel<IModels.Medicament>
      | IExtractModel<IModels.ApiMedicament>
    )[];
  }
  interface PlanPrise {
    id: number | null; //à enlever
    list: {
      status: TLoadingState;
      data?: IModels.PlanPrise['id'][];
    };
    content: {
      status: TLoadingState | 'deleted' | 'deleting' | 'creating';
      data?: IExtractModel<IModels.PlanPrise>;
    };
  }
  export interface State {
    app: IRedux.App;
    cache: IRedux.Cache;
    planPrise: IRedux.PlanPrise;
  }
}
