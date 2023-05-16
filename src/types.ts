import type { Writable, Readable, Subscriber, Unsubscriber } from "svelte/store";

export type { Writable, Readable, Subscriber, Unsubscriber };

export interface SetStore<T extends unknown> extends Writable<Set<T>> {
  get: () => Set<T>;
  add: (value: T) => void;
  delete: (value: T) => void;
  has: (value: T) => boolean;
  size: () => number;
  clear: () => void;
  // not included: keys, values, entries, forEach
}

export interface MapStore<TKey extends unknown, TValue extends unknown>
  extends Omit<Writable<Map<TKey, TValue>>, "set"> {
  get: () => Map<TKey, TValue>;
  /** Set the store to a new Map
   * @example
   * const a = new MapStore();
   * a.set(new Map());
   */
  set(newValue: Map<TKey, TValue>): void;
  /** Set the Map's key and value
   * @example
   * const a = new MapStore<string, number>();
   * a.set("items", 100);
   */
  set(key: TKey, value: TValue): void;
  delete: (value: TKey) => void;
  has: (key: TKey) => boolean;
  clear: () => void;
  size: () => number;
  // not included: keys, values, entries, forEach?
}
