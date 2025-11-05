import { faker } from "@faker-js/faker";
import { initTRPC } from "@trpc/server";
import { createAirport, delay } from "./utils.ts";

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

export const appRouter = router({
  simple: publicProcedure.query(async function () {
    return createAirport();
  }),

  paginated: publicProcedure.query(async function* ({ signal }) {
    let pagesLeft = 10;

    while (pagesLeft-- && !signal?.aborted) {
      yield faker.helpers.multiple(createAirport, { count: 300 });
      await delay(100);
    }
  }),

  count: publicProcedure.query(async function* () {
    let count = 1;

    while (count <= 40) {
      await delay(30);
      yield count++;
    }
  }),
});

export type AppRouter = typeof appRouter;
