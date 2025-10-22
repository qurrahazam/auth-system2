import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  itemName?: string; // e.g., "posts", "users", "items"
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  itemName = "items",
}: PaginationProps) {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    // Don't render anything if there's only 1 page or no pages
    if (totalPages <= 1) return null;

    // Always show first page
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentPage === 1
            ? "bg-emerald-600 text-white shadow-lg scale-105"
            : "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
        }`}
      >
        1
      </button>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis-1" className="px-2 text-gray-400">
          ...
        </span>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === i
              ? "bg-emerald-600 text-white shadow-lg scale-105"
              : "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
          }`}
        >
          {i}
        </button>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="ellipsis-2" className="px-2 text-gray-400">
          ...
        </span>
      );
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === totalPages
              ? "bg-emerald-600 text-white shadow-lg scale-105"
              : "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Don't render if there are no pages
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 shadow-sm hover:shadow-md"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">{renderPaginationButtons()}</div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 shadow-sm hover:shadow-md"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page Info */}
      {showInfo && (
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          {itemName}
        </p>
      )}
    </div>
  );
}