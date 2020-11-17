declare namespace Repositories {
  interface MedicamentRepository {
    id: string;
    type: string;
    data: {
      denomination: string;
      composition: string[];
    };
    attributes: {
      conservation_frigo: boolean;
      conservation_duree: {
        custom: boolean;
        data: string[] | string;
      };
      custom_precautions: Omit<Models.Precaution.Extracted, 'population'>[];
      indications: string[];
      posologies: Record<string, { id: string; label: string; value: string }>;
      precautions: (Models.Precaution.Extracted & { checked: boolean })[];
      voies_administration: string[];
    };
  }
  interface PlanPriseRepository {
    id: Models.PlanPrise.Entity['id'] | undefined;
    status: Redux.State['planPrise']['content']['status'];
    data?: IMedicamentRepository[];
  }
}

interface ContextProps {
  user?: IServerResponse<Models.App.User>;
}
