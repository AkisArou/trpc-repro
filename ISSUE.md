# httpBatchStreamLink: React Native (Expo) stream ends with TypeError while same stream works in web (Vite)

## Summary

A simple streaming query (async generator) works correctly in a Vite (web) client using `httpBatchStreamLink`, but in an Expo (React Native) app the stream delivers all data and then throws:

```text
TypeError: The stream is not in a state that permits close
```

The web client completes cleanly; only the Expo client produces the error at stream termination.

## Packages / Versions

All tRPC packages resolved to: `@trpc/client@11.5.0`, `@trpc/server@11.5.0`, `@trpc/tanstack-react-query@11.5.0`.

React / runtime:

- Expo SDK 54 (`expo@~54.0.9`)
- React Native 0.81.4
- React 19.1.0
- Vite 7 (web client)
- Node.js server (standalone adapter)

## Reproduction Steps

1. Start the server:

```bash
pnpm dev:node
```

2. (Optional) Start web client (works fine):

```bash
pnpm dev:vite
```

3. Start Expo client:

```bash
pnpm dev:expo
```

4. Observe counts increment; after final emission the Expo client logs the TypeError, while the Vite client finishes normally.

Order does not matter—Expo consistently shows the error only at completion.

## Expected Behavior

Expo client should finish the stream without throwing, just like the Vite client.

## Actual Behavior (Expo)

- All streamed values arrive.
- After final chunk, an error is raised:

  ```text
  TypeError: The stream is not in a state that permits close
  ```

## Server Code (minimal)

```ts
// packages/server/src/_app.ts
import { publicProcedure, router } from "./trpc.ts";

export const appRouter = router({
  greeting: publicProcedure.query(async function* () {
    let count = 1;
    while (count <= 5) {
      await new Promise((res) => setTimeout(res, 1000));
      console.log(`Sending count: ${count}`);
      yield count++;
    }
  }),
});
```

```ts
// apps/node-app/src/index.ts
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "@packages/trpc-server/_app.ts";
import cors from "cors";

createHTTPServer({
  router: appRouter,
  middleware: cors(),
}).listen(3000, "0.0.0.0");
```

## Shared Client Setup

```ts
// packages/client/src/trpc.ts
import {
  createTRPCClient as _createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@packages/trpc-server/_app.ts";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function createTRPCClient({ url, fetch }: { url: string; fetch?: any }) {
  return _createTRPCClient<AppRouter>({
    links: [
      loggerLink({ enabled: () => true }),
      httpBatchStreamLink({ url, fetch }),
    ],
  });
}
```

## Vite Client (Works)

```tsx
// apps/vite-app/src/App.tsx
const query = useQuery(trpc.greeting.queryOptions());
const count = query.data?.at(-1) ?? 0;
```

## Expo Client (Throws on completion)

```tsx
// apps/expo-app/app/_layout.tsx
const [trpcClient] = useState(() =>
  createTRPCClient({
    url: process.env.EXPO_PUBLIC_TRPC_URL,
    fetch: (url, opts) =>
      fetch(url, {
        ...opts,
        reactNative: { textStreaming: true },
      }),
  })
);

const query = useQuery(trpc.greeting.queryOptions());
```

Environment sanity checks (all defined):

```text
TextDecoder / TextDecoderStream / ReadableStream / WritableStream present
```

## Raw Stream Frames (from Vite client)

```json
{"0":[[0],[null,0,0]]}
[0,0,[[{"result":0}],["result",0,1]]]
[1,0,[[{"data":0}],["data",0,2]]]
[2,0,[[0],[null,1,3]]]
[3,1,[[1]]]
[3,1,[[2]]]
[3,1,[[3]]]
[3,1,[[4]]]
[3,1,[[5]]]
[3,1,[[6]]]
[3,1,[[7]]]
[3,1,[[8]]]
[3,1,[[9]]]
[3,1,[[10]]]
[3,0,[[]]]
```

## Hypothesis

Possibly an interaction between:

- `fetch` shim provided by `expo/fetch` with `reactNative: { textStreaming: true }`
- Stream closing logic in `httpBatchStreamLink`
- React Native’s underlying WHATWG stream polyfill semantics (close vs cancel)

The error suggests a premature or duplicate close on an already closed stream.
