export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  fields?: Record<string, unknown>;
  requestId?: string;
  userId?: string;
  traceId?: string;
}

export interface Logger {
  debug(message: string, fields?: Record<string, unknown>): void;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
  withField(key: string, value: unknown): Logger;
  withFields(fields: Record<string, unknown>): Logger;
  withRequestId(requestId: string): Logger;
  withUserId(userId: string): Logger;
  withTraceId(traceId: string): Logger;
}

const LEVEL_ORDER: LogLevel[] = ['debug', 'info', 'warn', 'error'];

class StructuredLogger implements Logger {
  private fields: Record<string, unknown>;
  private service: string;
  private minLevel: LogLevel;
  private correlationIds: { requestId?: string; userId?: string; traceId?: string };

  constructor(
    service: string,
    fields: Record<string, unknown> = {},
    correlationIds: { requestId?: string; userId?: string; traceId?: string } = {},
    minLevel: LogLevel = 'info',
  ) {
    this.service = service;
    this.fields = fields;
    this.correlationIds = correlationIds;
    this.minLevel = minLevel;
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
    return new StructuredLogger(
      this.service,
      { ...this.fields, [key]: value },
      this.correlationIds,
      this.minLevel,
    );
  }

  withFields(fields: Record<string, unknown>): Logger {
    return new StructuredLogger(
      this.service,
      { ...this.fields, ...fields },
      this.correlationIds,
      this.minLevel,
    );
  }

  withRequestId(requestId: string): Logger {
    return new StructuredLogger(
      this.service,
      this.fields,
      { ...this.correlationIds, requestId },
      this.minLevel,
    );
  }

  withUserId(userId: string): Logger {
    return new StructuredLogger(
      this.service,
      this.fields,
      { ...this.correlationIds, userId },
      this.minLevel,
    );
  }

  withTraceId(traceId: string): Logger {
    return new StructuredLogger(
      this.service,
      this.fields,
      { ...this.correlationIds, traceId },
      this.minLevel,
    );
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
      ...(this.correlationIds.requestId && { requestId: this.correlationIds.requestId }),
      ...(this.correlationIds.userId && { userId: this.correlationIds.userId }),
      ...(this.correlationIds.traceId && { traceId: this.correlationIds.traceId }),
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
    return LEVEL_ORDER.indexOf(level) >= LEVEL_ORDER.indexOf(this.minLevel);
  }
}

export const logger = new StructuredLogger('acme-shop-frontend');

export function createLogger(service: string): Logger {
  return new StructuredLogger(service);
}
