"use client";

import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  createdAt: string;
  views?: number;
  likes?: number;
}

export default function TopPosts({ posts }: { posts: Post[] }) {
  const topPosts = [...posts]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 6);

  const maxViews = topPosts[0]?.views || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800">Top Performing Posts</h3>
          <p className="text-sm text-gray-500">Your top articles by views</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {topPosts.map((p, i) => {
          const pct = Math.round(((p.views ?? 0) / maxViews) * 100);

          return (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl p-4 border border-gray-100 hover:shadow-md bg-gradient-to-b from-white to-gray-50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-semibold">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-medium text-gray-800 truncate max-w-[180px]"
                        title={p.title}
                      >
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{p.views}</div>
                  <div className="text-xs text-gray-500">views</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{p.views ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{p.likes ?? 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
