import { router } from "../trpc";
import { clubEventsRouter } from "./clubEvents";
import { companyInfoRouter } from "./companyInfo";
import { rbacRouter } from "./rbac";
import { translationRouter } from "./translation";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  rbac: rbacRouter,
  companyInfo: companyInfoRouter,
  clubEvents: clubEventsRouter,
  translation: translationRouter,
});

export type AppRouter = typeof appRouter;
