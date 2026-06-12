"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { BannerPlacement } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { clubTheme } from "./club-theme";

type BannerRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
};

type Variant = "hero" | "secondary" | "page";

type Props = {
  placement: BannerPlacement;
  variant?: Variant;
  className?: string;
  /** Intervalo de auto-avance en carrusel (ms). 0 = desactivado */
  autoPlayMs?: number;
};

function BannerSlide({
  banner,
  variant,
  priority,
}: {
  banner: BannerRow;
  variant: Variant;
  priority?: boolean;
}) {
  const isHero = variant === "hero";
  const heightClass =
    variant === "page"
      ? "aspect-[3/1] min-h-[140px] sm:min-h-[180px]"
      : isHero
        ? "aspect-[21/9] min-h-[200px] sm:min-h-[260px] lg:min-h-[320px]"
        : "aspect-[16/7] min-h-[160px] sm:min-h-[200px]";

  const inner = (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-[1.75rem] border border-black/[0.06] shadow-lg dark:border-white/[0.06]",
        heightClass
      )}
    >
      <Image
        src={banner.imageUrl}
        alt={banner.title ?? "Banner promocional"}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        sizes={
          isHero
            ? "(max-width: 1024px) 100vw, 1280px"
            : "(max-width: 768px) 100vw, 640px"
        }
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/85 via-[#050608]/45 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
        {banner.title ? (
          <h2
            className={cn(
              "font-bold leading-tight text-white drop-shadow-sm",
              isHero
                ? "text-2xl sm:text-3xl lg:text-4xl"
                : "text-lg sm:text-xl lg:text-2xl"
            )}
          >
            {banner.title}
          </h2>
        ) : null}
        {banner.subtitle ? (
          <p
            className={cn(
              "mt-2 max-w-2xl text-white/85",
              isHero ? "text-sm sm:text-base" : "text-xs sm:text-sm"
            )}
          >
            {banner.subtitle}
          </p>
        ) : null}
        {banner.linkUrl && variant !== "page" ? (
          <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-white/25 sm:text-sm">
            Ver más
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
    </div>
  );

  if (banner.linkUrl) {
    const external = banner.linkUrl.startsWith("http");
    if (external) {
      return (
        <a
          href={banner.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] focus-visible:ring-offset-2 rounded-[1.75rem]"
        >
          {inner}
        </a>
      );
    }
    return (
      <Link
        href={banner.linkUrl}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] focus-visible:ring-offset-2 rounded-[1.75rem]"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}

function BannerCarousel({
  banners,
  variant,
  autoPlayMs = 7000,
  className,
}: {
  banners: BannerRow[];
  variant: Variant;
  autoPlayMs?: number;
  className?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || autoPlayMs <= 0 || banners.length <= 1) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [api, autoPlayMs, banners.length]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: banners.length > 1, align: "start" }}
      className={cn("w-full", className)}
    >
      <CarouselContent className="-ml-0">
        {banners.map((banner, index) => (
          <CarouselItem key={banner.id} className="pl-0">
            <BannerSlide
              banner={banner}
              variant={variant}
              priority={index === 0}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {banners.length > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Ir al banner ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                activeIndex === i
                  ? "bg-[#00C8FF]"
                  : "bg-[#7E2CFF]/30 hover:bg-[#7E2CFF]/60"
              )}
            />
          ))}
        </div>
      ) : null}
    </Carousel>
  );
}

function SecondaryGrid({ banners }: { banners: BannerRow[] }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        banners.length === 1
          ? "grid-cols-1"
          : banners.length === 2
            ? "sm:grid-cols-2"
            : "sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {banners.map((banner, index) => (
        <BannerSlide
          key={banner.id}
          banner={banner}
          variant="secondary"
          priority={index === 0}
        />
      ))}
    </div>
  );
}

/**
 * Banners promocionales del sitio público (gestionados en /dashboard/club-banners).
 */
export function ClubSiteBanners({
  placement,
  variant = "hero",
  className,
  autoPlayMs = 7000,
}: Props) {
  const { data: banners, isLoading } = trpc.siteBanners.listPublic.useQuery(
    { placement },
    { staleTime: 120_000 }
  );

  if (isLoading || !banners?.length) return null;

  const sectionPadding =
    variant === "page" ? clubTheme.sectionYCompact : clubTheme.sectionY;

  return (
    <section
      className={cn(
        sectionPadding,
        clubTheme.pageBg,
        variant === "hero" && "pb-6 pt-4 sm:pb-8 sm:pt-6",
        variant === "secondary" && "py-8 sm:py-10",
        className
      )}
      aria-label="Promociones"
    >
      <div className="mx-auto max-w-7xl">
        {variant === "secondary" && banners.length <= 3 ? (
          <SecondaryGrid banners={banners} />
        ) : (
          <BannerCarousel
            banners={banners}
            variant={variant}
            autoPlayMs={autoPlayMs}
          />
        )}
      </div>
    </section>
  );
}
