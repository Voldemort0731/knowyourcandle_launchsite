import React from "react";
import { Compare } from "@/components/ui/compare";

export default function CompareDemo() {
  return (
    <Compare
      firstImage="/before-latest.png"
      secondImage="/after-latest.png"
      firstImageClassName="object-cover object-center"
      secondImageClassname="object-cover object-center"
      className="h-[360px] w-full md:h-[500px]"
      slideMode="drag"
    />
  );
}
