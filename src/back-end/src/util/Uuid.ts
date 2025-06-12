import { v4 } from "uuid";

const Uuid = {
  generate(): string {
    return v4();
  },
};
