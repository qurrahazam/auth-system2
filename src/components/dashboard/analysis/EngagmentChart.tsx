"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface Post {
  createdAt: string;
  views?: number;
  likes?: number;
}

export default function EngagementChart({ posts }: { posts: Post[] }) {
  const chartData = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((p) => ({
      date: new Date(p.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      views: p.views || 0,
      likes: p.likes || 0,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Engagement Over Time
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#10b981"
            strokeWidth={2}
            name="Views"
          />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="#6366f1"
            strokeWidth={2}
            name="Likes"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
