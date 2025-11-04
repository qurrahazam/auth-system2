// AnalysisDashboardClient.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import AnalyticsOverview from "./AnalyticsOverview";
import EngagementChart from "./EngagmentChart";
import AudienceInsights from "./AudienceInsight";
import TopPosts from "./TopPosts";

interface Post {
  _id: string;
  title: string;
  views: number;
  likes: number;
  createdAt: string;
  category?: string;
}

export default function AnalyticsDashboardClient({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-8 p-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-200"
    >
      <AnalyticsOverview posts={posts} />
      <div className="grid md:grid-cols-3 gap-6">
        <EngagementChart posts={posts} />
        <AudienceInsights posts={posts} />
      </div>
      <TopPosts posts={posts} />
    </motion.div>
  );
}