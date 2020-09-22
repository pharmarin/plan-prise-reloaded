declare namespace Models {
  interface User {
    [key: string]: string | undefined;
    name?: string;
    display_name?: string;
    email?: string;
  }
}

declare namespace Props {
  interface Card {
    id: MedicamentID;
  }
  interface Content {
    isOpened: boolean;
    medicament: Medicament;
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
    medicament: MedicamentID;
  }
  interface Interface {}
  interface NavbarLinkProps {
    args?: any;
    className?: string;
    label: string;
    light?: boolean;
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
