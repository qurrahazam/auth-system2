"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Post {
  _id: string;
  title: string;
  views: number;
  likes: number;
  createdAt: string;
}

export default function AnalysisDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await fetch("/api/posts/user");
        const data = await res.json();

        if (res.ok) {
          setPosts(Array.isArray(data) ? data : []);
          setFilteredPosts(Array.isArray(data) ? data : []);
        } else {
          setError("Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Something went wrong while fetching your posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredPosts(posts);
      return;
    }

    const start = startDate ? new Date(startDate) : new Date("2000-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const filtered = posts.filter((post) => {
      const postDate = new Date(post.createdAt);
      return postDate >= start && postDate <= end;
    });

    setFilteredPosts(filtered);
  }, [startDate, endDate, posts]);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md border border-emerald-100 text-center text-gray-600">
        Loading your analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md border border-red-100 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md border border-emerald-100 text-center text-gray-600">
        You haven’t posted anything yet.
      </div>
    );
  }

  const totalViews = filteredPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = filteredPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const avgViews = filteredPosts.length ? (totalViews / filteredPosts.length).toFixed(1) : "0";
  const avgLikes = filteredPosts.length ? (totalLikes / filteredPosts.length).toFixed(1) : "0";

  const topPosts = [...filteredPosts].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-100 space-y-8">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6">Post Analytics</h2>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-emerald-200 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-emerald-200 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-4 bg-emerald-50 rounded-xl text-center">
          <h3 className="text-emerald-700 font-semibold">Posts</h3>
          <p className="text-2xl font-bold">{filteredPosts.length}</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl text-center">
          <h3 className="text-emerald-700 font-semibold">Total Views</h3>
          <p className="text-2xl font-bold">{totalViews}</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl text-center">
          <h3 className="text-emerald-700 font-semibold">Total Likes</h3>
          <p className="text-2xl font-bold">{totalLikes}</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl text-center">
          <h3 className="text-emerald-700 font-semibold">Avg Views/Post</h3>
          <p className="text-2xl font-bold">{avgViews}</p>
        </div>
      </div>

      <div className="h-72 bg-emerald-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">Views vs Likes per Post</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredPosts}>
            <XAxis dataKey="title" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#10b981" name="Views" />
            <Bar dataKey="likes" fill="#6366f1" name="Likes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">Top Performing Posts</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-emerald-700">
              <th className="py-2">Title</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {topPosts.map((p) => (
              <tr key={p._id} className="border-b hover:bg-emerald-50/60">
                <td className="py-2 font-medium truncate max-w-[200px]">{p.title}</td>
                <td>{p.views}</td>
                <td>{p.likes}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
