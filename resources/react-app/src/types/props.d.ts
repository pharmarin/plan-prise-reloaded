declare namespace Props {
  declare namespace Backend {
    interface AttributesEdit {
      medicament: ExtractModel<Models.Medicament>;
    }
    interface MedicamentEdit {
      medicament: ExtractID<Models.Medicament> &
        Pick<ExtractModel<Models.Medicament>, 'denomination' | 'precautions'>;
    }
    interface MedicamentPagination {
      last: number | null;
      loading: boolean;
      page: number;
      prevPage: number | null;
      setPages: (page: number, previous: number) => void;
    }
    interface MedicamentTable {
      data: ExtractModel<Models.Medicament>[];
    }
    interface PrecautionEdit {
      cibles: { id: string; label: string }[];
      precaution: ExtractID<Models.Precaution>;
      remove: (id: string) => void;
    }
  }
  interface Card {
    identifier: Models.MedicamentIdentityWithLoading;
  }
  interface Content {
    isOpened: boolean;
    identifier: Models.MedicamentIdentityWithLoading;
  }
  interface CustomInput {
    onChange: (value: string) => function;
    readOnly?: boolean;
    value: string;
  }
  interface InputGroup {
    input: {
      id: string;
      default: boolean;
      display?: string;
      help?: string;
      join?: string;
      label: string;
      multiple?: boolean;
      readOnly?: boolean;
    };
    medicament: Models.MedicamentIdentity;
  }
  interface Interface {}
  interface NavbarLinkProps {
    args?: { id: number };
    className?: string;
    label: string;
    light?: boolean;
    path: string;
  }
  interface ProtectedRoute {
    admin?: boolean;
    children: React.ReactNode;
  }
  interface SplashScreen {
    type: 'load' | 'info' | 'danger' | 'warning';
    message: string;
    button?: {
      label: string;
      path: string;
    };
  }
}
