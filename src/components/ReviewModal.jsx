"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function ReviewModal({ isOpen, onClose, onSubmit, workerName }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!review.trim()) {
      return Swal.fire(
        "Review Required",
        "Please write your feedback.",
        "warning",
      );
    }

    try {
      setLoading(true);

      await onSubmit({
        rating,
        review,
      });

      setReview("");
      setRating(5);
      onClose();
    } catch (error) {
      console.log(error);

      Swal.fire("Error", error.message || "Failed to submit review", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Review {workerName}</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Rating</label>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-xl p-3 dark:bg-slate-800"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Feedback</label>

            <textarea
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full border rounded-xl p-3 dark:bg-slate-800"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-emerald-500 text-white py-2 rounded-xl"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>

            <button
              onClick={onClose}
              className="flex-1 bg-red-500 text-white py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
