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
import { Button, Text, View } from "react-native";

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

  const simpleQuery = useQuery(trpc.simple.queryOptions());

  const paginatedQuery = useQuery(trpc.paginated.queryOptions());

  const countQuery = useQuery(trpc.count.queryOptions());

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Paginated data length: {paginatedQuery.data?.flat().length}</Text>
      <Text>Current count: {countQuery.data?.at(-1) ?? 0}</Text>
      <Text>Simple query: {simpleQuery.data?.id}</Text>

      <Button
        title="Refresh"
        onPress={() => {
          simpleQuery.refetch();
          paginatedQuery.refetch();
          simpleQuery.refetch();
          countQuery.refetch();
        }}
      />
    </View>
  );
}
