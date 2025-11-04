"use client";

interface PostActionsMenuProps {
  postId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostActionsMenu({
  onEdit,
  onDelete,
}: PostActionsMenuProps) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onEdit}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Delete
      </button>
    </div>
  );
}
