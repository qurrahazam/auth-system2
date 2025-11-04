// useDeletePost.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useDeletePost(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Delete failed:", errText);
        toast.error("Failed to delete post");
        return;
      }

      toast.success("Post deleted successfully");

      // ✅ Trigger re-fetch callback
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDeletePost, isDeleting };
}
