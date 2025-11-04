import { motion } from "framer-motion";
import { TrendingUp, Calendar, Tag } from "lucide-react";

interface Post {
  views?: number;
  likes?: number;
  createdAt: string;
  category?: string;
}

export default function AudienceInsights({ posts }: { posts: Post[] }) {
  const totalViews = posts.reduce((a, p) => a + (p.views || 0), 0);
  const totalLikes = posts.reduce((a, p) => a + (p.likes || 0), 0);
  const engagementRate =
    totalViews > 0 ? `${((totalLikes / totalViews) * 100).toFixed(1)}%` : "0%";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCount: Record<string, number> = {};

  posts.forEach((p) => {
    const day = days[new Date(p.createdAt).getDay()];
    dayCount[day] = (dayCount[day] || 0) + 1;
  });

  const mostActiveDay =
    Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const catCount: Record<string, number> = {};
  posts
    .map((p) => p.category)
    .filter(Boolean)
    .forEach((c) => {
      catCount[c!] = (catCount[c!] || 0) + 1;
    });

  const topCategory =
    Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
    >
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Audience Insights
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Quick facts about your audience
      </p>

      <div className="space-y-3">
        <InfoRow icon={TrendingUp} label="Avg Engagement Rate" value={engagementRate} />
        <InfoRow icon={Calendar} label="Most Active Day" value={mostActiveDay} />
        <InfoRow icon={Tag} label="Top Category" value={topCategory} />
      </div>
    </motion.div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
