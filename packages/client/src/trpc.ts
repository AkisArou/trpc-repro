import {
  createTRPCClient as _createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@packages/trpc-server/_app.ts";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export function createTRPCClient({
  url,
  fetch,
}: {
  url: string;
  fetch?: (...args: any[]) => Promise<any>;
}) {
  return _createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: () => true,
      }),

      httpBatchStreamLink({
        fetch,
        url,
      }),
    ],
  });
}
