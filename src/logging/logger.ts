export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  fields?: Record<string, unknown>;
  service?: string;
  requestId?: string;
}

export interface Logger {
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
  withField(key: string, value: unknown): Logger;
  withFields(fields: Record<string, unknown>): Logger;
}

class StructuredLogger implements Logger {
  private fields: Record<string, unknown>;
  private service: string;
  private minLevel: LogLevel;

  constructor(service: string, fields: Record<string, unknown> = {}) {
    this.service = service;
    this.fields = fields;
    this.minLevel = 'info';
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  debug(message: string, fields?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      this.log('debug', message, fields);
    }
  }

  info(message: string, fields?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      this.log('info', message, fields);
    }
  }

  warn(message: string, fields?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      this.log('warn', message, fields);
    }
  }

  error(message: string, fields?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      this.log('error', message, fields);
    }
  }

  withField(key: string, value: unknown): Logger {
    return new StructuredLogger(this.service, {
      ...this.fields,
      [key]: value,
    });
  }

  withFields(fields: Record<string, unknown>): Logger {
    return new StructuredLogger(this.service, {
      ...this.fields,
      ...fields,
    });
  }

  private log(level: LogLevel, message: string, additionalFields?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      fields: {
        ...this.fields,
        ...additionalFields,
      },
    };

    const output = JSON.stringify(entry);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }
}

export const logger = new StructuredLogger('acme-shop-frontend-web');

export function createLogger(service: string): Logger {
  return new StructuredLogger(service);
}
