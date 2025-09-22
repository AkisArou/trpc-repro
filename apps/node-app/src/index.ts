import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "@packages/trpc-server/_app.ts";
import cors from "cors";

createHTTPServer({
  router: appRouter,
  middleware: cors(),
}).listen(3000, "0.0.0.0");
