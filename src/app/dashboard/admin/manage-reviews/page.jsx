"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const url =
        filter === "all"
          ? "/api/reviews?admin=true"
          : `/api/reviews?admin=true&status=${filter}`;

      const res = await fetch(url, {
        cache: "no-store",
      });
      const data = await res.json();

      setReviews(data?.data || []);
    } catch (error) {
      console.log(error);

      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Review?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (!confirm.isConfirmed) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((review) =>
            String(review._id) === String(id)
              ? { ...review, status: "approved" }
              : review,
          ),
        );

        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: "Review approved successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setReviews((prev) =>
          prev.filter((review) => String(review._id) !== String(id)),
        );

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Review removed successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center font-bold">Loading reviews...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black">Manage Reviews</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No reviews found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-white/10">
            <thead className="bg-emerald-500 text-white">
              <tr>
                <th className="p-3 text-left">Worker</th>
                <th className="p-3 text-left">Buyer</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Review</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-t border-gray-200 dark:border-white/10"
                >
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{review.worker_name}</p>
                      <p className="text-sm text-gray-500">
                        {review.worker_email}
                      </p>
                    </div>
                  </td>

                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{review.buyer_name}</p>
                      <p className="text-sm text-gray-500">
                        {review.buyer_email}
                      </p>
                    </div>
                  </td>

                  <td className="p-3">{"⭐".repeat(review.rating)}</td>

                  <td className="p-3 max-w-xs">{review.review_text}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.status === "approved" ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      {review.status === "pending" && (
                        <button
                          disabled={actionLoading}
                          onClick={() => handleApprove(review._id)}
                          className="px-3 py-1 rounded-lg bg-green-500 text-white disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        disabled={actionLoading}
                        onClick={() => handleDelete(review._id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
