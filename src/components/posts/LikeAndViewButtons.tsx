"use client";

import { useEffect, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LikeAndViewButtons({
  slug,
  initialLikes,
  initialViews,
}: {
  slug: string;
  initialLikes: number;
  initialViews: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [views, setViews] = useState(initialViews);
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const hasLiked = localStorage.getItem(`liked-${slug}`);
    if (hasLiked) setLiked(true);
    fetch(`/api/blog/${slug}/view`, { method: "POST" })
      .then(() => setViews((v) => v + 1))
  }, [slug]);

  const handleLike = async () => {
    if (liked) return;
    
    setLiked(true);
    setAnimate(true);
    setLikes((l) => l + 1);
    localStorage.setItem(`liked-${slug}`, "true");
    
    setTimeout(() => setAnimate(false), 600);

    try {
      await fetch(`/api/blog/${slug}/like`, { method: "POST" });
    } catch (error) {
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
        <Eye size={16} className="text-gray-500" />
        <span className="text-sm font-medium">{views.toLocaleString()}</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={liked}
        className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
          liked
            ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-50"
            : "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
        }`}
      >
        <motion.div
          animate={animate ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={16}
            className={`transition-all ${liked ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </motion.div>
        <span className="text-sm font-medium">{likes.toLocaleString()}</span>
      </Button>
    </div>
  );
}