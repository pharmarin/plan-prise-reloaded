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
      join?: string;
      label: string;
      multiple?: boolean;
    };
    medicament: MedicamentID;
  }
  interface InputItem {
    multiple?: boolean;
    name: string;
    value: string;
  }
}
