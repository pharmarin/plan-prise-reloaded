declare namespace Props {
  declare namespace Backend {
    interface AttributesEdit {
      medicament: Models.Medicament.Extracted;
    }
    interface MedicamentEdit {
      medicament: ExtractID<Models.Medicament.Entity> &
        Pick<Models.Medicament.Extracted, 'denomination' | 'precautions'>;
    }
    interface MedicamentPagination {
      last: number | null;
      loading: boolean;
      page: number;
      prevPage: number | null;
      setPages: (page: number, previous: number) => void;
    }
    interface MedicamentTable {
      data: Models.Medicament.Extracted[];
    }
    interface PrecautionEdit {
      cibles: { id: string; label: string }[];
      precaution: ExtractID<Models.Precaution.Entity>;
      remove: (id: string) => void;
    }
  }
  namespace Frontend {
    namespace App {
      interface ConnectionForm {
        message?: string;
      }
      interface DeleteUser {
        id: Models.App.User['id'];
        setUser: (user: object, authenticated?: boolean | undefined) => void;
      }
      interface EditInformations {
        user: IServerResponse<Models.App.User>;
        setUser: (user: object, authenticated?: boolean) => void;
      }
      interface EditPassword {
        id: Models.App.User['id'];
        email: Models.App.User['attributes']['email'];
      }
      interface NavbarLink {
        args?: { id: number };
        className?: string;
        label: string;
        light?: boolean;
        path: string;
      }
      interface ProtectedRoute {
        admin?: boolean;
        children: JSX.Element;
      }
      interface SplashScreen {
        type: 'load' | 'info' | 'danger' | 'warning';
        message: string;
        button?: {
          label: string;
          path: string;
        };
      }
      interface UpdatePasswordForm {
        isOpen: boolean;
        toggle: () => void;
        user: IServerResponse<Models.App.User>;
      }
    }
    namespace PlanPrise {
      interface Card {
        identifier: Models.MedicamentIdentityWithLoading;
      }
      interface Content {
        identifier: Models.MedicamentIdentityWithLoading;
      }
      interface CustomInput {
        onChange: (value: string) => function;
        readOnly?: boolean;
        value: string;
      }
      interface Settings {
        show: boolean;
        toggle?: (e: React.MouseEvent) => void;
      }
    }
  }
}
