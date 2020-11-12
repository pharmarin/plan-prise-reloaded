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
      custom_precautions: Omit<ExtractModel<Models.Precaution>, 'population'>[];
      indications: string[];
      posologies: Record<string, { id: string; label: string; value: string }>;
      precautions: (ExtractModel<Models.Precaution> & { checked: boolean })[];
      voies_administration: string[];
    };
  }
  interface PlanPriseRepository {
    id: Models.PlanPrise['id'] | undefined;
    status: Redux.State['planPrise']['content']['status'];
    data?: IMedicamentRepository[];
  }
}
