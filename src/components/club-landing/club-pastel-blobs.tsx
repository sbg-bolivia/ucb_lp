"use client";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Menos blobs para secciones internas */
  subtle?: boolean;
};

/** Formas ovaladas pastel — solo visible en modo claro */
export function ClubPastelBlobs({ className, subtle = false }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden dark:opacity-[0.18]",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute -left-[8%] top-[2%] h-[min(420px,55vw)] w-[min(520px,70vw)] rounded-[50%] opacity-45 blur-3xl"
        style={{ background: "var(--pastel-blue)" }}
      />
      <div
        className="absolute -right-[6%] top-[8%] h-[min(380px,50vw)] w-[min(460px,62vw)] rounded-[50%] opacity-50 blur-3xl"
        style={{ background: "var(--aws-orange-pastel)" }}
      />
      {!subtle ? (
        <>
          <div
            className="absolute bottom-[6%] right-[12%] h-[min(340px,45vw)] w-[min(400px,55vw)] rounded-[50%] opacity-30 blur-3xl"
            style={{ background: "var(--pastel-violet)" }}
          />
          <div
            className="absolute bottom-[18%] left-[4%] h-[min(280px,38vw)] w-[min(320px,42vw)] rounded-[50%] opacity-35 blur-3xl"
            style={{ background: "var(--pastel-pink-soft)" }}
          />
        </>
      ) : null}
    </div>
  );
}
