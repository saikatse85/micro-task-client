// src/components/home/FooterSection.jsx

import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* TOP */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-black text-black">
                T
              </div>

              <div>
                <h2 className="text-3xl font-black">TaskEarn</h2>

                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Micro Task Platform
                </p>
              </div>
            </div>

            <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete tasks, earn coins, and withdraw real money through our
              secure and modern micro-tasking platform.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4 mt-8">
              <button className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-900 hover:bg-emerald-500 transition text-xl">
                🌐
              </button>

              <button className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-900 hover:bg-emerald-500 transition text-xl">
                📘
              </button>

              <button className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-900 hover:bg-emerald-500 transition text-xl">
                📸
              </button>

              <button className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-900 hover:bg-emerald-500 transition text-xl">
                ▶️
              </button>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-2xl font-black mb-6">Quick Links</h3>

            <div className="flex flex-col gap-4 text-slate-600 dark:text-slate-400">
              <Link
                href="/"
                className="hover:text-emerald-400 transition footer-link"
              >
                Home
              </Link>

              <Link
                href="/dashboard"
                prefetch={false}
                className="hover:text-emerald-400 transition footer-link"
              >
                Dashboard
              </Link>

              <Link
                href="/tasks"
                className="hover:text-emerald-400 transition footer-link"
              >
                Tasks
              </Link>

              <Link
                href="/leaderboard"
                className="hover:text-emerald-400 transition footer-link"
              >
                Leaderboard
              </Link>

              <Link
                href="/faq"
                className="hover:text-emerald-400 transition footer-link"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* FEATURES */}
          <div>
            <h3 className="text-2xl font-black mb-6">Features</h3>

            <div className="flex flex-col gap-4 text-slate-600 dark:text-slate-400">
              <p>⚡ Fast Withdrawals</p>
              <p>🔐 Secure Authentication</p>
              <p>📈 Real-Time Updates</p>
              <p>💰 Daily Earnings</p>
              <p>🌍 Global Access</p>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-2xl font-black mb-6">Newsletter</h3>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Subscribe to receive new task updates and earning opportunities.
            </p>

            <div className="mt-6 space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500"
              />

              <button className="w-full bg-emerald-500 hover:bg-emerald-600 transition rounded-2xl py-4 font-bold text-black">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE CARD */}
        <div className="mt-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-black">
          <div>
            <h2 className="text-4xl font-black">Ready to Earn More?</h2>

            <p className="mt-4 text-lg opacity-80 max-w-2xl">
              Join thousands of workers and buyers growing together on our
              platform.
            </p>
          </div>

          <button className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition">
            Get Started
          </button>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 dark:text-slate-400 text-center md:text-left">
            © 2026 TaskEarn. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms & Conditions
            </Link>

            <Link href="/support" className="hover:text-emerald-400 transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
