import type { AuditLog } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';

function getAuditLogsFromStorage(): AuditLog[] {
  const stored = getJson<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS);
  return stored ?? [];
}

export function getAuditLogs(): AuditLog[] {
  return getAuditLogsFromStorage();
}

export function addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog[] {
  const list = getAuditLogsFromStorage();
  const newEntry: AuditLog = {
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date(),
  };
  const next = [newEntry, ...list];
  setJson(STORAGE_KEYS.AUDIT_LOGS, next);
  return next;
}
