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

  paginated: publicProcedure.query(async function* () {
    yield faker.helpers.multiple(createAirport, { count: 300 });
  }),

  count: publicProcedure.query(async function* () {
    yield 1;
  }),
});

export type AppRouter = typeof appRouter;
