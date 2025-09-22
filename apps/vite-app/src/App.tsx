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

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    createTRPCClient({
      url: "http://localhost:3000",
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
  const query = useQuery(trpc.greeting.queryOptions());

  const count = query.data?.at(-1) ?? 0;

  return <p>Count {count}</p>;
}
