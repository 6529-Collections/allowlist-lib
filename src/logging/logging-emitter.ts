import { Time } from '../time';

export class LoggerFactory {
  constructor(private readonly listener: LogListener) {}

  create(name: string): Logger {
    return new Logger(this.listener, name);
  }
}

class ConsoleLogListener implements LogListener {
  debug(message: string) {
    console.debug(`[${ConsoleLogListener.timeNow()}] ${message}`);
  }

  error(message: string) {
    console.error(`[${ConsoleLogListener.timeNow()}] ${message}`);
  }

  info(message: string) {
    console.info(`[${ConsoleLogListener.timeNow()}] ${message}`);
  }

  warn(message: string) {
    console.info(`[${ConsoleLogListener.timeNow()}] ${message}`);
  }

  private static timeNow(): string {
    return Time.now().shortFormatUTC();
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
      method(`${this.name}: ${message} ${JSON.stringify(params)}`);
    } else {
      method(`${this.name}: ${message}`);
    }
  }
}

export interface LogListener {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
}
