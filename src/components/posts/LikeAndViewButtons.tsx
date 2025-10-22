"use client";

import { useEffect, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    fetch(`/api/blog/${slug}/view`, { method: "POST" })
      .then(() => setViews((v) => v + 1))
  }, [slug]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((l) => l + 1);
    try {
      await fetch(`/api/blog/${slug}/like`, { method: "POST" });
    } catch (error) {
    }
  };

  return (
    <div className="flex items-center gap-6 mt-6">
      <div className="flex items-center gap-2 text-gray-600">
        <Eye size={18} />
        <span className="text-sm font-medium">{views}</span>
      </div>
      <Button
        variant={liked ? "secondary" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={liked}
        className={`flex items-center gap-2 ${
          liked
            ? "bg-emerald-100 text-emerald-600 border-emerald-300"
            : "hover:bg-emerald-50"
        }`}
      >
        <Heart
          size={16}
          className={liked ? "fill-emerald-500 text-emerald-500" : ""}
        />
        <span className="text-sm font-medium">{likes}</span>
      </Button>
    </div>
  );
}
