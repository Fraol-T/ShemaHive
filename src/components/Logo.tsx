import React from "react";
import Image from "next/image";
import { BRAND } from "@/data/brand";

interface LogoProps {
  /** "light" for beige surfaces (navy ink), "dark" for navy surfaces (cream ink). */
  on: "light" | "dark";
  className?: string;
  priority?: boolean;
}

export default function Logo({ on, className = "h-9", priority = false }: LogoProps) {
  return (
    <Image
      src={on === "dark" ? "/brand/logo-on-dark.png" : "/brand/logo-on-light.png"}
      alt={BRAND.name}
      width={640}
      height={503}
      priority={priority}
      className={`${className} w-auto object-contain`}
    />
  );
}
