import { signal, WritableSignal } from '@angular/core';

export interface EntityStore<T extends { id: string }> {
  items: WritableSignal<T[]>;
  getById: (id: string) => T | undefined;
  add: (item: T) => void;
  update: (id: string, changes: Partial<T>) => void;
  remove: (id: string) => void;
  upsert: (item: T) => void;
}

export function createEntityStore<T extends { id: string }>(initial: T[]): EntityStore<T> {
  const items = signal<T[]>(initial);
  return {
    items,
    getById: (id) => items().find((i) => i.id === id),
    add: (item) => items.update((list) => [item, ...list]),
    update: (id, changes) =>
      items.update((list) => list.map((i) => (i.id === id ? { ...i, ...changes } : i))),
    remove: (id) => items.update((list) => list.filter((i) => i.id !== id)),
    upsert: (item) =>
      items.update((list) => {
        const idx = list.findIndex((i) => i.id === item.id);
        if (idx === -1) return [item, ...list];
        const copy = [...list];
        copy[idx] = item;
        return copy;
      }),
  };
}

let counter = 0;
export function generateId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}
