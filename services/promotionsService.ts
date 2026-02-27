import type { Promotion } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { INITIAL_PROMOTIONS } from '../constants';

function getPromotionsFromStorage(): Promotion[] {
  const stored = getJson<Promotion[]>(STORAGE_KEYS.PROMOTIONS);
  return stored ?? INITIAL_PROMOTIONS;
}

export function getPromotions(): Promotion[] {
  return getPromotionsFromStorage();
}

export function getActivePromotions(): Promotion[] {
  const list = getPromotionsFromStorage();
  const now = new Date();
  return list.filter(
    (p) =>
      p.active &&
      new Date(p.validFrom) <= now &&
      now <= new Date(p.validTo)
  );
}

export function addPromotion(promotion: Promotion): Promotion[] {
  const list = getPromotionsFromStorage();
  const next = [...list, promotion];
  setJson(STORAGE_KEYS.PROMOTIONS, next);
  return next;
}

export function updatePromotion(promotionId: string, updates: Partial<Promotion>): Promotion[] {
  const list = getPromotionsFromStorage();
  const next = list.map((p) => (p.id === promotionId ? { ...p, ...updates } : p));
  setJson(STORAGE_KEYS.PROMOTIONS, next);
  return next;
}
