import { Attribute, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';

class User extends jsonapi(Model) {
  static type = 'users';

  @Attribute()
  first_name!: string;

  @Attribute()
  last_name!: string;

  @Attribute()
  display_name?: string;

  @Attribute()
  email!: string;

  @Attribute()
  admin!: boolean;

  @Attribute()
  status!: 'student' | 'pharmacist';

  @Attribute()
  rpps?: number;

  @Attribute()
  created_at!: string;
}

export default User;
