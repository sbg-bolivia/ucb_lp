import { router } from "../trpc";
import { awsCommunitiesRouter } from "./awsCommunities";
import { awsServicesRouter } from "./awsServices";
import { clubEventsRouter } from "./clubEvents";
import { clubProjectsRouter } from "./clubProjects";
import { companyInfoRouter } from "./companyInfo";
import { dashboardStatsRouter } from "./dashboardStats";
import { rbacRouter } from "./rbac";
import { translationRouter } from "./translation";
import { siteBannersRouter } from "./siteBanners";
import { uploadsRouter } from "./uploads";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  rbac: rbacRouter,
  companyInfo: companyInfoRouter,
  clubEvents: clubEventsRouter,
  clubProjects: clubProjectsRouter,
  awsServices: awsServicesRouter,
  awsCommunities: awsCommunitiesRouter,
  uploads: uploadsRouter,
  translation: translationRouter,
  dashboardStats: dashboardStatsRouter,
  siteBanners: siteBannersRouter,
});

export type AppRouter = typeof appRouter;
