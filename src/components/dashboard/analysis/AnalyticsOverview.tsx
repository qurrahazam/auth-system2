import { Eye, Heart, TrendingUp, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion"; // optional — works with server components if used statically

interface Post {
  views: number;
  likes: number;
  createdAt: string;
}

export default function AnalyticsOverview({ posts }: { posts: Post[] }) {
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);

  const engagementRate =
    !posts.length || totalViews === 0
      ? "0%"
      : `${((totalLikes / totalViews) * 100).toFixed(1)}%`;

  const avgViews = posts.length ? (totalViews / posts.length).toFixed(1) : "0";
  const avgLikes = posts.length ? (totalLikes / posts.length).toFixed(1) : "0";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCount: Record<string, number> = {};

  posts.forEach((p) => {
    const day = days[new Date(p.createdAt).getDay()];
    dayCount[day] = (dayCount[day] || 0) + 1;
  });

  const mostActiveDay =
    Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Soft insights into your post performance
          </p>
        </div>
        <div className="flex gap-4">
          <Metric icon={Eye} label="Views" value={totalViews} />
          <Metric icon={Heart} label="Likes" value={totalLikes} />
          <Metric icon={TrendingUp} label="Engagement" value={engagementRate} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Total Posts" value={posts.length} icon={Calendar} />
        <StatCard label="Avg Views / Post" value={avgViews} icon={Eye} />
        <StatCard label="Avg Likes / Post" value={avgLikes} icon={Heart} />
        <StatCard label="Most Active Day" value={mostActiveDay} icon={Clock} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
    </motion.div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex gap-3 bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-500" />
        <div className="text-sm">
          <div className="text-xs text-gray-500">{label}</div>
          <div className="font-semibold text-gray-800">{value}</div>
        </div>
      </div>
    </div>
  );
}
