import { z } from "zod";

export const coreTeamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(200),
  image: z.string().max(2000).optional().nullable(),
  instagram: z.string().max(2000).optional().nullable(),
  linkedin: z.string().max(2000).optional().nullable(),
  github: z.string().max(2000).optional().nullable(),
});

export const coreTeamArraySchema = z.array(coreTeamMemberSchema).max(30);

export type CoreTeamMember = z.infer<typeof coreTeamMemberSchema>;

export function parseCoreTeamJson(value: unknown): CoreTeamMember[] | null {
  const r = coreTeamArraySchema.safeParse(value);
  return r.success ? r.data : null;
}
