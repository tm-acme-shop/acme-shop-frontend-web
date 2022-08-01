export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export function formatLogEntry(payload: LogPayload): string {
  const contextStr = payload.context
    ? ` ${JSON.stringify(payload.context)}`
    : '';
  return `[${payload.timestamp}] ${payload.level.toUpperCase()}: ${payload.message}${contextStr}`;
}

export interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>) => void;
}

export function createLogger(name: string): Logger {
  const log = (level: LogLevel, message: string, context?: Record<string, unknown>) => {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...context, logger: name },
    };

    const formatted = formatLogEntry(payload);

    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }
  };

  return {
    debug: (message, context) => log('debug', message, context),
    info: (message, context) => log('info', message, context),
    warn: (message, context) => log('warn', message, context),
    error: (message, context) => log('error', message, context),
  };
}

export const logger = createLogger('app');
