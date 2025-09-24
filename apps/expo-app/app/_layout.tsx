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
  experimental_streamedQuery as streamedQuery,
  queryOptions,
} from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

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
  // TRPC
  const trpc = useTRPC();
  const query = useQuery(trpc.greeting.queryOptions());
  const count = query.data?.at(-1) ?? 0;

  // // FETCH
  // const fetchQuery = useQuery(
  //   queryOptions({
  //     queryKey: ["count"],
  //     queryFn: streamedQuery({
  //       streamFn: fetchStream,
  //     }),
  //     staleTime: Infinity,
  //   }),
  // );
  // const countFetch = fetchQuery.data?.at(-1) ?? 0;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Count from tRPC {count}</Text>
      <Pressable
        onPress={() => {
          query.refetch();
        }}
      >
        <Text>Refresh</Text>
      </Pressable>
      {/* <Text>Count from fetch {countFetch}</Text> */}
    </View>
  );
}

async function* fetchStream() {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_TRPC_URL}/count`.replace("3000", "3001"),
  );

  if (!response.body) {
    console.error("No response body");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("[vanilla fetch] Stream finished");
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      console.log("[vanilla fetch] Received chunk:", chunk.trim());
      yield chunk.trim();
    }
  } catch (err) {
    console.error("[vanilla fetch] Stream error:", err);
  } finally {
    reader.releaseLock();
  }
}

fetchStream();
