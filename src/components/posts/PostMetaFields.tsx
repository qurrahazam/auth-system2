"use client";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import Image from "next/image";

export function PostMetaFields({
  register,
  control,
  preview,
  setPreview,
  categories,
  errors,
  handleTitleChange,
  watch,
}: any) {
  const title = watch("title");

  return (
    <div className="space-y-5">

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter post title"
          {...register("title", { required: "Title is required" })}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>


      <div>
        <Label htmlFor="slug">Slug (auto-generated)</Label>
        <Input
          id="slug"
          {...register("slug", { required: "Slug is required" })}
        />
      </div>


      <div>
        <Label htmlFor="coverImage">Cover Image</Label>
        <div className="flex items-center gap-4">
          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => (
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  field.onChange(e.target.files);
                  if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            )}
          />
          <ImagePlus className="text-emerald-500" />
        </div>
        {preview && (
          <div className="mt-3">
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={150}
              className="rounded-xl shadow-md border border-emerald-100"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          placeholder="Short summary of your post..."
          {...register("excerpt")}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full p-2 border border-gray-200 rounded-md"
          {...register("category")}
        >
          <option value="">Select category</option>
          {categories.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          placeholder="e.g. react, javascript, ui"
          {...register("tags")}
        />
      </div>
    </div>
  );
}
