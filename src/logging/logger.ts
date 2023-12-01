import { ENABLE_DEBUG_LOGGING } from '../config/featureFlags';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
  [key: string]: unknown;
}

export interface Logger {
  debug(message: string, payload?: LogPayload): void;
  info(message: string, payload?: LogPayload): void;
  warn(message: string, payload?: LogPayload): void;
  error(message: string, payload?: LogPayload): void;
}

function formatLogEntry(level: LogLevel, message: string, payload?: LogPayload): string {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    level,
    message,
    ...payload,
  };
  return JSON.stringify(entry);
}

function createLogger(): Logger {
  return {
    debug(message: string, payload?: LogPayload): void {
      if (ENABLE_DEBUG_LOGGING) {
        console.debug(formatLogEntry('debug', message, payload));
      }
    },

    info(message: string, payload?: LogPayload): void {
      console.info(formatLogEntry('info', message, payload));
    },

    warn(message: string, payload?: LogPayload): void {
      console.warn(formatLogEntry('warn', message, payload));
    },

    error(message: string, payload?: LogPayload): void {
      console.error(formatLogEntry('error', message, payload));
    },
  };
}

export const logger = createLogger();
