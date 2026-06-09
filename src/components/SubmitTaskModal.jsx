"use client";

import Image from "next/image";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export default function SubmitTaskModal({ task, isOpen, onClose }) {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const [submissionText, setSubmissionText] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !task) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const uploadedUrl = await uploadImageToCloudinary(file);

      setProofImage(uploadedUrl);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Unable to upload proof image.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user?.email) {
        Swal.fire({
          icon: "error",
          title: "User Not Loaded",
          text: "Please login again.",
        });
        return;
      }

      if (!submissionText.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Submission Required",
          text: "Please write submission details.",
        });
        return;
      }
      if (!proofImage) {
        Swal.fire({
          icon: "warning",
          title: "Proof Required",
          text: "Please upload a work proof image.",
        });
        return;
      }
      setLoading(true);

      await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: task._id,
          task_title: task.task_title,
          payable_amount: task.payable_amount,

          buyer_email: task.buyer_email,
          buyer_name: task.buyer_name,

          worker_email: user.email,
          worker_name: user.displayName || user.name,
          worker_photo: user.photoURL || "",

          submission_details: submissionText,
          proof_image: proofImage,
        }),
      });
      await Swal.fire({
        icon: "success",
        title: "Task Submitted!",
        text: "Your submission has been sent successfully.",
        confirmButtonColor: "#10b981",
      });
      setSubmissionText("");
      setProofImage("");
      onClose();

      router.push("/dashboard/my-submissions");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-xl">
        <h2 className="text-2xl font-bold text-emerald-500">Submit Task</h2>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-semibold">Title:</span> {task.task_title}
          </p>

          <p>
            <span className="font-semibold">Details:</span> {task.task_detail}
          </p>

          <p>
            <span className="font-semibold">Buyer:</span> {task.buyer_name}
          </p>

          <p>
            <span className="font-semibold">Deadline:</span> {task.deadline}
          </p>

          <p>
            <span className="font-semibold">Reward:</span> {task.payable_amount}{" "}
            Coins
          </p>

          <p>
            <span className="font-semibold">Workers Left:</span>{" "}
            {task.required_workers}
          </p>
        </div>
        <div className="mt-5">
          <label className="block text-sm font-medium mb-2">
            Upload Work Proof
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
          />

          {uploading && (
            <p className="text-emerald-500 text-sm mt-2">Uploading image...</p>
          )}

          {proofImage && (
            <div className="mt-3">
              <Image
                src={proofImage}
                alt="Proof Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-xl border"
              />
            </div>
          )}
        </div>
        <textarea
          value={submissionText}
          onChange={(e) => setSubmissionText(e.target.value)}
          placeholder="Write your submission details..."
          className="w-full mt-5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500 text-white py-2 rounded-xl"
          >
            {loading ? "Submitting..." : "Submit Work"}
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
  );
}
