import { getJson, setJson, getStorageAdapter, STORAGE_KEYS } from './storageAdapter';

export const SELECTED_BRANCH_ALL = 'ALL';

export function getSelectedBranchId(): string {
  const raw = getStorageAdapter().getItem(STORAGE_KEYS.SELECTED_BRANCH);
  return raw ?? SELECTED_BRANCH_ALL;
}

export function setSelectedBranchId(branchId: string): void {
  getStorageAdapter().setItem(STORAGE_KEYS.SELECTED_BRANCH, branchId);
}
