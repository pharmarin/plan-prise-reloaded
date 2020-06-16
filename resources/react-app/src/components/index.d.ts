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
  interface Input {
    input: {
      id: string;
      default: boolean;
      label: string;
    };
    medicament: MedicamentID;
  }
}
