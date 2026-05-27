"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-30"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-programming-on-screen-1563741758844?download=1080p"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="relative z-10 w-full">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full"
        >
          {/* ================= SLIDE 1 ================= */}
          <SwiperSlide>
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center min-h-screen">
              {/* LEFT */}
              <div>
                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm border border-emerald-500/30">
                  Earn Coins • Complete Tasks • Get Paid
                </span>

                <h1 className="text-5xl md:text-7xl font-black mt-6 leading-tight">
                  Complete Small Tasks &
                  <span className="text-emerald-400"> Earn Money</span>
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-lg mt-6 max-w-xl">
                  Join thousands of workers and buyers on our micro-tasking
                  platform.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="bg-emerald-500 hover:bg-emerald-600 transition px-8 py-4 rounded-2xl font-semibold">
                    Start Earning
                  </button>

                  <button className="border border-gray-200 dark:border-white/20 px-8 py-4 rounded-2xl font-semibold">
                    Explore Tasks
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div>
                    <h3 className="text-3xl font-bold text-emerald-400">
                      10K+
                    </h3>
                    <p className="text-slate-400">Tasks Completed</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-emerald-400">5K+</h3>
                    <p className="text-slate-400">Active Workers</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-emerald-400">
                      $20K+
                    </h3>
                    <p className="text-slate-400">Paid Earnings</p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative">
                <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">Available Balance</p>

                      <h2 className="text-5xl font-black mt-2">5,250</h2>

                      <span className="text-emerald-400">Coins</span>
                    </div>

                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl">
                      💰
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="bg-white/5 dark:bg-slate-900/60 rounded-2xl p-4 flex justify-between">
                      <div>
                        <p className="font-semibold">YouTube Comment Task</p>

                        <span className="text-slate-400 text-sm">
                          Reward: 20 Coins
                        </span>
                      </div>

                      <button className="bg-emerald-500 px-4 py-2 rounded-xl text-sm">
                        Accept
                      </button>
                    </div>

                    <div className="bg-white/5 dark:bg-slate-900/60 rounded-2xl p-4 flex justify-between">
                      <div>
                        <p className="font-semibold">Instagram Follow Task</p>

                        <span className="text-slate-400 text-sm">
                          Reward: 15 Coins
                        </span>
                      </div>

                      <button className="bg-emerald-500 px-4 py-2 rounded-xl text-sm">
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* ================= SLIDE 2 ================= */}
          <SwiperSlide>
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center min-h-screen">
              {/* LEFT */}
              <div>
                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm border border-emerald-500/30">
                  Build Your Ranking • Earn More • Grow Faster
                </span>

                <h1 className="text-5xl md:text-7xl font-black mt-6 leading-tight">
                  Become a Top
                  <span className="text-emerald-400"> Worker</span>
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-lg mt-6 max-w-xl">
                  Complete daily micro-tasks and unlock premium opportunities.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="bg-emerald-500 hover:bg-emerald-600 transition px-8 py-4 rounded-2xl font-semibold">
                    Join Tasks
                  </button>

                  <button className="border border-gray-200 dark:border-white/20 px-8 py-4 rounded-2xl font-semibold">
                    View Leaderboard
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div>
                    <h3 className="text-3xl font-bold text-emerald-400">
                      Top 1%
                    </h3>
                    <p className="text-slate-400">Elite Workers</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-emerald-400">50+</h3>
                    <p className="text-slate-400">Task Types</p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-emerald-400">
                      24/7
                    </h3>
                    <p className="text-slate-400">Active System</p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative">
                <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">Worker Level</p>

                      <h2 className="text-5xl font-black mt-2">Level 12</h2>

                      <span className="text-emerald-400">Pro Status</span>
                    </div>

                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl">
                      🏆
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="bg-white/5 dark:bg-slate-900/60 rounded-2xl p-4 flex justify-between">
                      <div>
                        <p className="font-semibold">Daily Bonus Task</p>

                        <span className="text-slate-400 text-sm">
                          Reward: 25 Coins
                        </span>
                      </div>

                      <button className="bg-emerald-500 px-4 py-2 rounded-xl text-sm">
                        Claim
                      </button>
                    </div>

                    <div className="bg-white/5 dark:bg-slate-900/60 rounded-2xl p-4 flex justify-between">
                      <div>
                        <p className="font-semibold">Survey Completion</p>

                        <span className="text-slate-400 text-sm">
                          Reward: 30 Coins
                        </span>
                      </div>

                      <button className="bg-emerald-500 px-4 py-2 rounded-xl text-sm">
                        Start
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* ================= SLIDE 3 ================= */}
          <SwiperSlide>
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center min-h-screen">
              {/* LEFT */}
              <div>
                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm border border-emerald-500/30">
                  Instant Withdrawals • Secure Payments
                </span>

                <h1 className="text-5xl md:text-7xl font-black mt-6 leading-tight">
                  Withdraw Your
                  <span className="text-emerald-400"> Earnings Instantly</span>
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-lg mt-6 max-w-xl">
                  Convert your earned coins into real money anytime.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="bg-emerald-500 hover:bg-emerald-600 transition px-8 py-4 rounded-2xl font-semibold">
                    Withdraw Now
                  </button>

                  <button className="border border-gray-200 dark:border-white/20 px-8 py-4 rounded-2xl font-semibold">
                    Payment Methods
                  </button>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative">
                <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400">Withdrawal Balance</p>

                      <h2 className="text-5xl font-black mt-2">3,750</h2>

                      <span className="text-emerald-400">Coins Ready</span>
                    </div>

                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl">
                      💳
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="bg-white/5 dark:bg-slate-900/60 rounded-2xl p-4 flex justify-between">
                      <div>
                        <p className="font-semibold">Bank Transfer</p>

                        <span className="text-slate-400 text-sm">2-5 min</span>
                      </div>

                      <button className="bg-emerald-500 px-4 py-2 rounded-xl text-sm">
                        Select
                      </button>
                    </div>

                    <div className="bg-white/5 dark:bg-slate-900/60 rounded-2xl p-4 flex justify-between">
                      <div>
                        <p className="font-semibold">Mobile Payment</p>

                        <span className="text-slate-400 text-sm">Instant</span>
                      </div>

                      <button className="bg-emerald-500 px-4 py-2 rounded-xl text-sm">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
