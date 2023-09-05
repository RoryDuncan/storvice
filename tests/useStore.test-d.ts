/* eslint-disable react-hooks/rules-of-hooks */
import { readable, writable, useStore, Writable, get } from "../src";
import { expectError, expectNever, expectType } from "tsd";

export function test_readable_stores() {
  const readableStore = readable("abc");
  const [readableValue] = useStore(readableStore);

  expectType<string>(readableValue);

  if (typeof readableValue !== "string") {
    expectNever(readableValue);
  }
}

export function test_writable_stores() {
  const writableStore = writable(123);
  const [writableValue, setValue, updateValue] = useStore(writableStore);

  expectType<number>(writableValue);
  expectType<Writable<number>["set"]>(setValue);
  expectType<Writable<number>["update"]>(updateValue);

  if (typeof writableValue !== "number") {
    expectNever(writableValue);
  }
}

export function test_incorrect_store() {
  const incorrectType: string = "not a store";
  // @ts-expect-error
  const result: never = useStore(incorrectType);
  expectNever(result);
}

export function test_store_contracts() {
  // these types should match a "store contract" from svelte/store
  interface StoreContract<T> {
    subscribe: (run: (value: T) => void) => () => void;
  }

  interface UpdateContract<T> {
    set: (value: T) => void;
    update: (callback: (value: T) => T) => void;
  }

  const readableStoreContract: StoreContract<string> = {
    subscribe: (run: (value: string) => void) => {
      run("hello");
      return () => {};
    },
  };

  const [readableStoreContractValue] = useStore(readableStoreContract);
  expectType<string>(readableStoreContractValue);

  const writableStoreContract: StoreContract<number> & UpdateContract<number> = {
    subscribe: (run: (value: number) => void) => {
      run(1000);
      return () => {};
    },

    set: (value: number) => {
      console.log(value);
    },
    update: (callback) => writableStoreContract.set(callback(get(writableStoreContract))),
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [writableStoreContractValue, setWSC, updateWSC] = useStore(writableStoreContract);
  expectType<number>(writableStoreContractValue);
  expectType<UpdateContract<number>["set"]>(setWSC);
  expectType<UpdateContract<number>["update"]>(updateWSC);
}
