/** Evita TS2589 (inferencia Zod + tRPC demasiado profunda) en useMutation. */

export type TrpcMutationCallbacks = {
  onSuccess?: (...args: unknown[]) => void;
  onError?: (e: { message: string }) => void;
};

export type ShallowMutation = {
  mutate: (input?: Record<string, unknown>) => void;
  mutateAsync: (input?: Record<string, unknown>) => Promise<unknown>;
  isPending: boolean;
};

type MutationProcedure = {
  useMutation: (opts?: TrpcMutationCallbacks) => ShallowMutation;
};

export function useTrpcMutation(
  procedure: unknown,
  opts?: TrpcMutationCallbacks
): ShallowMutation {
  return (procedure as MutationProcedure).useMutation(opts);
}
