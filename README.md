# tRPC Fetch Stream Reproduction (`httpBatchStreamLink`)

## Issue Overview

In our **Expo** app, when pressing the **Refresh** button to refetch data, there is roughly a **20% chance** that the following error occurs:

```text
[TRPCClientError: JSON Parse error: Unexpected character: i]
```

In our app, when this happens, **all subsequent batched queries fail** with errors.

Occasionally, when launching the Expo app, another error appears:

```text
[TRPCClientError: Unknown error]
```

In some cases, an additional error has been observed indicating that **the response is not an AsyncIterable** (or similar wording).

The implementation follows the official tRPC documentation:
👉 [tRPC `httpBatchStreamLink` (React Native)](https://trpc.io/docs/client/links/httpBatchStreamLink#react-native)

---

## Setup Description

The project defines three tRPC procedures:

1. **Streamed paginated query** — fetches a paginated list of objects.
2. **Streamed counter query** — fetches a simple numeric count.
3. **Regular query** — fetches a single object.

---

## Steps to Reproduce

```bash
pnpm dev:node   # Start the Node.js streaming server
pnpm dev:expo   # Start the Expo client
```

Then:

1. Press the **Refresh** button in the app.
2. About 1 in 5 times, a **JSON parse error** is thrown.

---

## Relevant Source Files

- **tRPC router definition:** `packages/server/src/trpc.ts`
- **tRPC client definition:** `packages/client/src/trpc.ts`
- **Node.js server entry point:** `apps/node-app/src/index.ts`
- **Expo app tRPC usage:** `apps/expo-app/app/_layout.tsx`
