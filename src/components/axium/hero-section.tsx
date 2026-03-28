"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat min-h-screen flex items-center"
      style={{ backgroundImage: "url(/hero2.png)" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="relative flex flex-col items-center justify-between min-h-[70vh]">
          {/* Centered Headline - Positioned higher */}
          <div className="text-center space-y-6 lg:space-y-8 max-w-4xl pt-8 lg:pt-16">
            <h1 className="text-heading-1 text-white leading-tight font-semibold">
              Software Personalizado para{" "}
              <span className="bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] bg-clip-text text-transparent">
                Empresas en Crecimiento
              </span>{" "}
              y Grandes Organizaciones
            </h1>
          </div>

          {/* Description Box - Positioned at bottom */}
          <div className="flex justify-end w-full mt-auto pb-8 lg:pb-16">
            <div className="max-w-xs lg:max-w-sm rounded-3xl p-5 lg:p-6 bg-transparent border border-white/20 backdrop-blur-xl">
              <p className="text-body text-white/90 mb-5 leading-relaxed">
                Nos asociamos con empresas y organizaciones de todas las
                industrias ayudándolas a construir equipos de ingeniería
                exitosos y crear productos de software innovadores.
              </p>

              <Button
                size="lg"
                className="relative w-full bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] text-white rounded-lg py-2.5 px-5 text-sm font-medium flex items-center justify-center gap-2 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105 hover:shadow-[#0072CF]/50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#7ECFC3] to-[#0072CF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  AGENDA UNA LLAMADA
                  <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
