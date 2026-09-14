export class YahooNotConnectedError extends Error {
  constructor() {
    super("Yahoo account is not connected");
    this.name = "YahooNotConnectedError";
  }
}

export class YahooConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "YahooConfigError";
  }
}
