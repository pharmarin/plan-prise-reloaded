declare namespace Models {
  interface User {
    [key: string]: string | undefined;
    name?: string;
    display_name?: string;
    email?: string;
  }
}
