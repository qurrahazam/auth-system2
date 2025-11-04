"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-white/20 p-6 space-y-4"
        >
          <Skeleton className="h-48 w-full rounded-md bg-gray-200/50" />
          <Skeleton className="h-6 w-3/4 bg-gray-200/50" />
          <Skeleton className="h-4 w-full bg-gray-200/50" />
          <Skeleton className="h-4 w-5/6 bg-gray-200/50" />
        </div>
      ))}
    </div>
  );
}
