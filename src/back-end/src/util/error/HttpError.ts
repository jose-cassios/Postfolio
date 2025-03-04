export class HttpError extends Error {
  status: number;
  //   msg: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    // this.msg = msg;
  }
}
