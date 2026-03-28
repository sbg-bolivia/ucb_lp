"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { cases } from "~/data/cases-data";

export function CasesSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on("select", () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);
  return (
    <section
      id="casos"
      className="py-20 md:py-28 overflow-hidden relative bg-gray-950"
    >
      {/* Mesh gradient with subtle blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tl from-slate-900/80 via-transparent to-blue-950/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/40 to-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent" />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Casos de exito
            </h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="px-6 py-2 border border-white text-white hover:bg-white/10 transition-colors rounded-md font-medium whitespace-nowrap"
              >
                Ver portafolio
              </button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={!canScrollPrev}
                onClick={() => api?.scrollPrev()}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={!canScrollNext}
                onClick={() => api?.scrollNext()}
              >
                <ArrowRight className="w-4 h-4" />
                <span className="sr-only">Next slide</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel Section - Only left padding */}
        <div className="pl-4 sm:pl-6 lg:pl-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              dragFree: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {cases.map((caseItem) => (
                <CarouselItem
                  key={caseItem.title}
                  className="pl-4 sm:pl-6 basis-[85%] sm:basis-[70%] md:basis-[60%] lg:basis-[45%] xl:basis-[35%]"
                >
                  <Card className="border border-gray-700/50 hover:border-gray-600 hover:shadow-2xl transition-all duration-300 bg-gray-900/50 backdrop-blur-sm overflow-hidden group h-full">
                    {/* Image Section - 60% of card */}
                    <div className="relative h-[320px] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      <img
                        src={caseItem.image}
                        alt={caseItem.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Industry Badge */}
                      <Badge
                        variant="secondary"
                        className="absolute top-4 left-4 bg-secondary text-white hover:bg-secondary/90 shadow-lg"
                      >
                        {caseItem.industry}
                      </Badge>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                          {caseItem.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Section - 40% of card */}
                    <CardContent className="p-6 flex flex-col gap-4">
                      {/* Description */}
                      <p className="text-body-small text-gray-300 line-clamp-2">
                        {caseItem.description}
                      </p>

                      {/* Services Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {caseItem.services.slice(0, 2).map((service) => (
                          <span
                            key={service}
                            className="text-xs bg-accent/20 border border-accent/40 text-accent px-3 py-1 rounded-full font-medium"
                          >
                            {service}
                          </span>
                        ))}
                        {caseItem.services.length > 2 && (
                          <span className="text-xs bg-gray-700/50 border border-gray-600 text-gray-300 px-3 py-1 rounded-full font-medium">
                            +{caseItem.services.length - 2}
                          </span>
                        )}
                      </div>

                      {/* View More Indicator */}
                      <div className="flex items-center gap-2 text-secondary font-semibold text-sm mt-2 group-hover:gap-3 transition-all">
                        <span>Ver detalles</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
