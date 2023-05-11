export class LoggerFactory {
  constructor(private readonly listener: LogListener) {}

  create(name: string): Logger {
    return new Logger(this.listener, name);
  }
}

class ConsoleLogListener implements LogListener {
  debug(message: string) {
    console.debug(`${new Date()} ${message}`);
  }

  error(message: string) {
    console.error(`${new Date()} ${message}`);
  }

  info(message: string) {
    console.info(`${new Date()} ${message}`);
  }

  warn(message: string) {
    console.info(`${new Date()} ${message}`);
  }
}

export const defaultLogFactory = new LoggerFactory(new ConsoleLogListener());

export class Logger {
  constructor(
    private readonly listener: LogListener,
    private readonly name: string,
  ) {}

  debug(message: string, params?: any) {
    this.log(this.listener.debug, message, params);
  }

  info(message: string, params?: any) {
    this.log(this.listener.info, message, params);
  }

  warn(message: string, params?: any) {
    this.log(this.listener.warn, message, params);
  }

  error(message: string, params?: any) {
    this.log(this.listener.error, message, params);
  }

  private log(method: (string) => void, message: string, params?: any) {
    if (params) {
      message = `${this.name}: ${message} ${JSON.stringify(params)}`;
    }
    method(message);
  }
}

export interface LogListener {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
}
