import { router } from "../trpc";
import { companyInfoRouter } from "./companyInfo";
import { rbacRouter } from "./rbac";
import { translationRouter } from "./translation";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  rbac: rbacRouter,
  companyInfo: companyInfoRouter,
  translation: translationRouter,
});

export type AppRouter = typeof appRouter;
