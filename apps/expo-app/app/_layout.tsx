import { fetch } from "expo/fetch";
import {
  createTRPCClient,
  TRPCProvider,
  useTRPC,
} from "@packages/trpc-client/trpc.ts";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { Text, View } from "react-native";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    createTRPCClient({
      url: process.env.EXPO_PUBLIC_TRPC_URL,
      fetch: (url, opts) =>
        fetch(url, {
          ...opts,
          reactNative: { textStreaming: true },
        }),
    }),
  );

  //@ts-ignore
  console.assert(globalThis.TextDecoder !== undefined);
  //@ts-ignore
  console.assert(globalThis.TextDecoderStream !== undefined);
  //@ts-ignore
  console.assert(globalThis.TextDecoderStream !== undefined);
  //@ts-ignore
  console.assert(globalThis.ReadableStream !== undefined);
  //@ts-ignore
  console.assert(globalThis.WritableStream !== undefined);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        <Inner />
      </TRPCProvider>
    </QueryClientProvider>
  );
}

function Inner() {
  const trpc = useTRPC();
  const query = useQuery(trpc.greeting.queryOptions());

  const count = query.data?.at(-1) ?? 0;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Count {count}</Text>
    </View>
  );
}
