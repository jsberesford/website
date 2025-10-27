"use client";

import React from "react";

export default function ProfilePicture({ size = 160 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-white/10 flex-shrink-0 bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/jared.jpg"
        alt="Jared"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
