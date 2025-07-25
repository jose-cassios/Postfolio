import Email from "@user/domain/valueObject/Email";

export default class User {
  id: string;
  name: string;
  email: Email;
  password: string | null;
  status: string;

  constructor(
    id: string,
    name: string,
    email: Email,
    password: string | null,
    status: string = "None"
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.status = status;
  }
}
