import { createLogger } from '../logging/logger';

const logger = createLogger('requestId');

export function generateRequestId(): string {
  logger.debug('Generating request ID');
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @deprecated Use generateRequestId() instead
 * TODO(TEAM-SEC): Remove generateUUID once all callers use generateRequestId
 */
export function generateUUID(): string {
  console.log('Generating UUID');
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isValidRequestId(id: string): boolean {
  return /^[a-f0-9-]{36}$/.test(id);
}
