import { router } from "../trpc";
import { awsCommunitiesRouter } from "./awsCommunities";
import { awsServicesRouter } from "./awsServices";
import { clubEventsRouter } from "./clubEvents";
import { clubProjectsRouter } from "./clubProjects";
import { companyInfoRouter } from "./companyInfo";
import { rbacRouter } from "./rbac";
import { translationRouter } from "./translation";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  rbac: rbacRouter,
  companyInfo: companyInfoRouter,
  clubEvents: clubEventsRouter,
  clubProjects: clubProjectsRouter,
  awsServices: awsServicesRouter,
  awsCommunities: awsCommunitiesRouter,
  translation: translationRouter,
});

export type AppRouter = typeof appRouter;
