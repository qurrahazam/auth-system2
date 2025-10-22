"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function PostFormActions({ loading, handleSubmit, onSubmit }: any) {
  return (
    <div className="flex gap-3 justify-end mt-6">
      <Button
        type="button"
        disabled={loading}
        onClick={handleSubmit((data: any) => onSubmit(data, "draft"))}
        className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-medium shadow-sm text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
          </>
        ) : (
          "Save Draft"
        )}
      </Button>

      <Button
        type="button"
        disabled={loading}
        onClick={handleSubmit((data: any) => onSubmit(data, "published"))}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Submitting...
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );
}
