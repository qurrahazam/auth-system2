"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
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

interface PostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  coverImage?: string;
  status: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(null);

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
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data: PostData = await res.json();

        if (res.ok) {
          setValue("title", data.title);
          setValue("slug", data.slug);
          setValue("content", data.content);
          setValue("excerpt", data.excerpt || "");
          setValue("category", data.category || "");
          setValue("tags", data.tags || "");

          if (data.coverImage) {
            setExistingCoverImage(data.coverImage);
          }
        } else {
          setMessage("Failed to load post");
        }
      } catch (error) {
        setMessage("Failed to load post");
      } finally {
        setFetching(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id, setValue]);

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

      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(
          status === "draft"
            ? "Draft saved successfully!"
            : "Post updated successfully!"
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setMessage(result.error || "Failed to update post");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Tech", "Travel", "Food", "Lifestyle", "Business"];

  if (fetching) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">Loading post...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto backdrop-blur-md bg-white/80 border border-emerald-100 shadow-lg rounded-3xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-emerald-700 text-center mb-8">
          Edit Post
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
              existingCoverImage={existingCoverImage}
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
                isEdit={true}
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
