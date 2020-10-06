declare namespace IProps {
  declare namespace Backend {
    interface MedicamentTable {
      data?: IModels.Medicament[];
    }
    interface MedicamentPagination {
      last: number | null;
      loading: boolean;
      page: number;
      prevPage: number | null;
      setPages: (page: number, previous: number) => void;
    }
  }
  interface Card {
    id: IMedicamentID;
  }
  interface Content {
    isOpened: boolean;
    id: IMedicamentID;
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
    medicament: IMedicamentID;
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
    path: string;
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
