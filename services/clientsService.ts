import type { Client } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { INITIAL_CLIENTS } from '../constants';

function getClientsFromStorage(): Client[] {
  const stored = getJson<Client[]>(STORAGE_KEYS.CLIENTS);
  return stored ?? INITIAL_CLIENTS;
}

export function getClients(): Client[] {
  return getClientsFromStorage();
}

export function addClient(client: Client): Client[] {
  const list = getClientsFromStorage();
  const next = [...list, client];
  setJson(STORAGE_KEYS.CLIENTS, next);
  return next;
}
