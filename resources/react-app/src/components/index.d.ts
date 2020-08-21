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
  interface InputItem {
    checked: boolean;
    display: string;
    help?: string;
    multiple?: 'checkbox' | 'radio';
    name: string;
    readOnly?: boolean;
    value: string;
  }
}
