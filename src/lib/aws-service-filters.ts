import type { AwsServiceCategory } from "@prisma/client";

export type ServiceFilterKey =
  | "all"
  | "fundamentals"
  | "compute"
  | "serverless"
  | "data"
  | "ml"
  | "devops";

export const SERVICE_FILTER_LABELS: Record<ServiceFilterKey, string> = {
  all: "Todos",
  fundamentals: "Fundamentos",
  compute: "Cómputo",
  serverless: "Serverless",
  data: "Datos",
  ml: "IA/ML",
  devops: "DevOps",
};

const FILTER_MAP: Record<
  Exclude<ServiceFilterKey, "all">,
  AwsServiceCategory[]
> = {
  fundamentals: ["OTHER", "MANAGEMENT"],
  compute: ["COMPUTE"],
  serverless: ["COMPUTE", "INTEGRATION"],
  data: ["STORAGE", "DATABASE", "ANALYTICS"],
  ml: ["MACHINE_LEARNING", "ANALYTICS"],
  devops: ["MANAGEMENT", "INTEGRATION", "SECURITY", "NETWORKING"],
};

export function matchesServiceFilter(
  category: AwsServiceCategory,
  slug: string,
  filter: ServiceFilterKey
): boolean {
  if (filter === "all") return true;
  if (filter === "serverless" && /lambda|fargate|step|eventbridge/i.test(slug)) {
    return true;
  }
  return FILTER_MAP[filter].includes(category);
}
