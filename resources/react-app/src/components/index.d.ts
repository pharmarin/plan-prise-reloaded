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
  interface Interface {
    routeId: number;
  }
  interface NavbarLinkProps {
    className?: string;
    label: string;
    path: string;
  }
}
