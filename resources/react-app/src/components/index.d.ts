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
  interface SplashScreen {
    type: 'load' | 'info' | 'danger' | 'warning';
    message: string;
    button?: {
      label: string;
      path: string;
    };
  }
}
