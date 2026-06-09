"use client";

import { useEffect, useState } from "react";

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.data || []);
      });
  }, []);

  if (!reviews.length) return null;

  const displayReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black">What Users Say</h2>

          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            Trusted by thousands of users worldwide.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-8 marquee-track">
            {displayReviews.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="min-w-[380px] h-[260px] bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-8 flex-shrink-0 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  {item.worker_photo ? (
                    <img
                      src={item.worker_photo}
                      alt={item.worker_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-xl font-bold">
                      {item.worker_name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold">{item.worker_name}</h3>

                    <p className="text-emerald-500">
                      {"⭐".repeat(item.rating || 5)}
                    </p>
                  </div>
                </div>

                <p className="w-full max-w-[380px] text-slate-600 dark:text-slate-300 leading-relaxed text-base line-clamp-2 break-words">
                  {item.review_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          width: max-content;
          animation: marquee 35s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
