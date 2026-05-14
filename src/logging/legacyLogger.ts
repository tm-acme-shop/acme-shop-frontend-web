/**
 * Legacy structured logging functions.
 * Technically structured. Practically just console.log with a JSON wrapper.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function emit(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
  const entry = {
    level,
    message,
    ...extra,
  };
  console.log(JSON.stringify(entry));
}

export function legacyLog(message: string, extra?: Record<string, unknown>): void {
  emit('info', message, extra);
}

export function legacyWarn(message: string, extra?: Record<string, unknown>): void {
  emit('warn', message, extra);
}

export function legacyError(message: string, extra?: Record<string, unknown>): void {
  emit('error', message, extra);
}

export function legacyDebug(message: string, extra?: Record<string, unknown>): void {
  emit('debug', message, extra);
}
