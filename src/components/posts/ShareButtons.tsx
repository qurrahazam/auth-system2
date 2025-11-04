"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ShareButtonsProps {
  title: string;
  slug: string;
  large?: boolean;
}

export default function ShareButtons({ title, slug, large = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : "";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const buttonSize = large ? "default" : "sm";
  const iconSize = large ? 20 : 16;

  return (
    <div className={`flex items-center ${large ? "gap-3 justify-center" : "gap-2"}`}>
      <Button
        size={buttonSize}
        variant="outline"
        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors"
        onClick={() => window.open(shareLinks.twitter, "_blank")}
      >
        <Twitter size={iconSize} />
        {large && <span className="ml-2">Twitter</span>}
      </Button>

      <Button
        size={buttonSize}
        variant="outline"
        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors"
        onClick={() => window.open(shareLinks.facebook, "_blank")}
      >
        <Facebook size={iconSize} />
        {large && <span className="ml-2">Facebook</span>}
      </Button>

      <Button
        size={buttonSize}
        variant="outline"
        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 transition-colors"
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
      >
        <Linkedin size={iconSize} />
        {large && <span className="ml-2">LinkedIn</span>}
      </Button>

      <Button
        size={buttonSize}
        variant="outline"
        className={`transition-colors ${
          copied
            ? "bg-emerald-50 text-emerald-600 border-emerald-600"
            : "hover:bg-gray-100"
        }`}
        onClick={copyToClipboard}
      >
        {copied ? <Check size={iconSize} /> : <Link2 size={iconSize} />}
        {large && <span className="ml-2">{copied ? "Copied!" : "Copy Link"}</span>}
      </Button>
    </div>
  );
}