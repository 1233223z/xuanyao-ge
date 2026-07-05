"use client";

import dynamic from "next/dynamic";

const Atmosphere = dynamic(() => import("./Atmosphere").then((m) => m.default), {
  ssr: false,
});

export function AtmosphereWrapper() {
  return <Atmosphere />;
}
