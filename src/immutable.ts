
import { type Updater, writable, get as getValue } from "svelte/store";
import type { MapStore, SetStore } from "./types";

type SetConstructorParams<T> = ConstructorParameters<typeof Set<T>>[number];
type MapConstructorParams<K, V> = ConstructorParameters<typeof Map<K, V>>[number];


export const createSetStore = <T>(initialValue?: Iterable<T> | SetConstructorParams<T>): SetStore<T> => {
  // new Set(new Set()) is valid
  const inner = writable(new Set(initialValue));

  const update = (updater: Updater<Set<T>>) => {
    inner.update((oldSet: Set<T>) => {
      return updater(new Set(oldSet));
    });
  };

  const get = () => getValue(inner);

  return {
    ...inner,
    update,
    get,
    add: (value: T): void => update((next) => (next.add(value), next)),
    delete: (value: T): void => update((next) => (next.delete(value), next)),
    has: (value: T): boolean => get().has(value),
    size: () => get().size,
    clear: () => get().clear(),
  };
};

export const createMapStore = <K, V>(initialValue?: Map<K, V> | MapConstructorParams<K, V>): MapStore<K, V> => {
  const inner = writable(new Map(initialValue));

  const update = (updater: Updater<Map<K, V>>) => {
    inner.update((oldSet: Map<K, V>) => {
      return updater(new Map<K, V>(oldSet));
    });
  };

  const get = () => getValue(inner);

  const innerSet = inner.set;
  const mapSet = (key: K, value: V): void => update((next) => (next.set(key, value), next));

  return {
    ...inner,
    update,
    get,
    set: (keyOrNewMap: K | Map<K, V>, value?: V) => {
      if (value) {
        return mapSet(keyOrNewMap as K, value);
      } else {
        return innerSet(keyOrNewMap as Map<K, V>);
      }
    },
    delete: (key: K): void => update((next) => (next.delete(key), next)),
    has: (key: K): boolean => get().has(key),
    size: () => get().size,
    clear: () => get().clear(),
  };
};
