import { Suspense } from "react";
import DashboardPosts from "./DashboardPosts"; // adjust import path if needed

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading your posts...</div>}>
      <DashboardPosts />
    </Suspense>
  );
}
