# tRPC fetch stream reproduction

Apps involved:

- **Node.js** app: exposes a single streaming query that emits an incrementing counter (0 → 5) using tRPC.
- **Expo** app: subscribes to the stream and displays the counter.
- **Vite** web app: also subscribes to the same stream.

Issue observed:

**Expo** receives the streamed data correctly, but when the stream finishes an error is thrown:

```text
TypeError: The stream is not in a state that permits close
```

Implementation follows the official docs: [tRPC httpBatchStreamLink (React Native)](https://trpc.io/docs/client/links/httpBatchStreamLink#react-native)

**Vite** completes the stream without errors.

## Reproduction steps

```bash
pnpm dev:node   # start the Node.js streaming server
pnpm dev:expo   # start the Expo client
pnpm dev:vite   # (optional) start the Vite web client
```

## Extra info

Raw stream frames captured in the **Vite** web app:

```json
{"0":[[0],[null,0,0]]}
[0,0,[[{"result":0}],["result",0,1]]]
[1,0,[[{"data":0}],["data",0,2]]]
[2,0,[[0],[null,1,3]]]
[3,1,[[1]]]
[3,1,[[2]]]
[3,1,[[3]]]
[3,1,[[5]]]
[3,0,[[]]]
```
