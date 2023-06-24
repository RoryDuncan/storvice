# storvice

A hook and some nice typescript definitions that allow you to use svelte stores within react.

## Usage

### **As steps**

1.  Install the `storvice` package
1.  Install the peer-dependency `svelte`
1.  Import the `useStore` hook from the `storvice` package
    ```tsx
    import { useStore } from "storvice";
    ```

1.  Initatiate a svelte store

1.  Within a component: Pass the store to `useStore`, and destructure the value and setters
    ```tsx
    const [value, setValue, updateValue] = useStore(someStore);
    ```

#### **Code Sample**

The common "count" example:
```tsx
import { useStore } from "storvice";
import { writable } from "svelte/store";

const countStore = writable(0);

const SomeComponent = () => {
    const [count, setCount, updateCount] = useStore(countStore);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);

    return (<>
        <button onClick={increment}>+</button>
        <span>{value}</span>
        <button onClick={decrement}>-</button>
    </>);
}
 
export default SomeComponent;
```

## Rationale & Discussion

### To start with, an ode to svelte stores

[Svelte's](https://svelte.dev/docs) [stores](https://svelte.dev/docs/svelte-store) are tidy and approachable observable structures.

They are amazingly composable, but also amazingly simple to write. They have very few moving parts, and a very [concise typescript definition](https://github.com/sveltejs/svelte/blob/master/packages/svelte/src/runtime/store/public.d.ts).

So—with that...

### An alternative to redux

This package is the direct result of discourse around: "What if we used an alternative to redux with react". Which is by itself a conversation with a lot of smaller decisions along the way. This document won't capture that whole rationale—but it can seed the discussion for other people and teams.

So what does this package give you?
In code—very little.
In architectural freedom—a lot.

If you are considering delivering production-level applications built with react you are not given much choice. Usually the only choice is redux(or similar alternatives). 

This package offers an additional choice.

### Pattern

This package is only one part: the bridge between observable stores via hooks.

The second part is a "services pattern". Services are modules with methods for manipulating one or many stores. Services are the key for scalability and complex applications beyond a toy / proof-of-concept.

Because `Writable` stores expose their `set` and `update` methods—you could manipulate stores directly from the UI. Sometimes that is the appropriate decision for certain types of stores. While services are not necessary because you can directly manipulate stores—changing stores directly throughout your UI can lead to inconsistent model change. 

To centralize the changes made to stores, utilize async actions, compose complex state transitions, and allow additional effects from a change we put them in a function that can be imported throughout the codebase.

Assume an imaginary `src/stores/count.ts` to replace the `countStore` in the earlier example:
```ts
import { writable } from "svelte/store";
export const count = writable(0);
```

Within an imaginary `src/services/count.ts`:
```ts
import { count } from "../../stores/count";

export const syncCount = (value: number) => {
    count.set(value);
}

export const resetCount = () => {
    syncCount(0);
}
```

This pattern may not work for all web apps. It may need vetting for some apps.

