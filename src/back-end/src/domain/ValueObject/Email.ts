import validator from "validator";
import { BadRequest } from "@domain/error/HttpError";

export default class Email {
  private value: string;

  constructor(email: string, requiredValidation: boolean = true) {
    if (!validator.isEmail(email) && requiredValidation)
      throw new BadRequest("Email inválido!");
    this.value = email;
  }

  getValue(): string {
    return this.value;
  }
}
