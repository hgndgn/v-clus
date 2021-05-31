export class ClientError {
  private _title: string;
  private _message: string;
  private _code: string;

  constructor(error: any) {
    this._title = error.code;
    this._message = error.message;
    this._code = error.code;
  }

  get code() {
    return this._code;
  }
  get title() {
    return this._title;
  }
  get message() {
    return this._message;
  }
}
