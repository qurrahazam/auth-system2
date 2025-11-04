"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import PostFormLayout from "@/components/posts/PostFormLayout";
import { PostMetaFields } from "@/components/posts/PostMetaFields";
import { PostFormActions } from "@/components/posts/PostFormAction";
import RichTextEditor from "@/components/editor/TiptapEditor";

interface FormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  coverImage?: FileList;
}

export default function NewPostPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const title = watch("title");
  const contentValue = watch("content");

  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", slug);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (data: FormData, status: "draft" | "published") => {
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "coverImage" && value instanceof FileList && value[0]) {
          formData.append("coverImage", value[0], value[0].name);
        } else if (typeof value === "string" && value.trim() !== "") {
          formData.append(key, value);
        }
      });

      formData.append("status", status);

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(
          status === "draft"
            ? "Draft saved successfully!"
            : "Post Published!"
        );
        router.push("/dashboard");
      } else {
        setMessage(result.error || "Failed to create post");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Tech", "Travel", "Food", "Lifestyle", "Business"];

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl backdrop-blur-md bg-white/80 border border-emerald-100 shadow-lg rounded-3xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-emerald-700 text-center mb-8">
          New Post
        </h1>

        <PostFormLayout
          left={
            <PostMetaFields
              register={register}
              control={control}
              preview={preview}
              setPreview={setPreview}
              categories={categories}
              errors={errors}
              handleTitleChange={handleTitleChange}
              watch={watch}
            />
          }
          right={
            <div className="flex flex-col space-y-6">
              <div>
                <Label htmlFor="content" className="text-emerald-800 font-semibold">
                  Content
                </Label>
                <div className="mt-3 border border-emerald-100 rounded-xl bg-white shadow-sm p-3 hover:shadow-md transition-shadow">
                  <RichTextEditor
                    content={contentValue}
                    onChange={(html: string) =>
                      setValue("content", html, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                </div>

                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <PostFormActions
                loading={loading}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
              />

              {message && (
                <p className="text-center text-sm text-emerald-700 mt-4 font-medium">
                  {message}
                </p>
              )}
            </div>
          }
        />
      </motion.div>
    </main>
  );
}
