import { appRouter } from "@packages/trpc-server/trpc.ts";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";

createHTTPServer({
  router: appRouter,
  middleware: cors(),
}).listen(3000, "0.0.0.0");
