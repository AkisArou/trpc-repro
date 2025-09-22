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

export type AppRouter = typeof appRouter;
