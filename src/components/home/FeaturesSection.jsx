// src/components/home/FeaturesSection.jsx

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div>
          <h2 className="text-5xl font-black leading-tight">
            Powerful Features for Workers & Buyers
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-lg mt-6 leading-relaxed">
            Our platform is designed to make task management and online earning
            smooth, secure, and profitable.
          </p>

          <div className="space-y-6 mt-10">
            {/* FEATURE 1 */}
            <div className="flex gap-4">
              <div className="text-3xl">✅</div>

              <div>
                <h3 className="text-xl font-bold">Real-Time Notifications</h3>

                <p className="text-slate-400 mt-2">
                  Get notified instantly for approvals, rejections, and new
                  tasks.
                </p>
              </div>
            </div>

            {/* FEATURE 2 */}
            <div className="flex gap-4">
              <div className="text-3xl">🔐</div>

              <div>
                <h3 className="text-xl font-bold">Secure Authentication</h3>

                <p className="text-slate-400 mt-2">
                  JWT protected routes with role-based dashboard access.
                </p>
              </div>
            </div>

            {/* FEATURE 3 */}
            <div className="flex gap-4">
              <div className="text-3xl">⚡</div>

              <div>
                <h3 className="text-xl font-bold">Fast Withdrawals</h3>

                <p className="text-slate-400 mt-2">
                  Withdraw earnings quickly through multiple payment systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-2 gap-6">
          {/* CARD 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-white/10 h-56 flex flex-col justify-between">
            <div className="text-5xl">📈</div>

            <div>
              <h3 className="text-4xl font-black">98%</h3>

              <p className="text-slate-400 mt-2">Task Completion Rate</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-emerald-500 rounded-3xl p-8 text-black h-56 flex flex-col justify-between">
            <div className="text-5xl">💵</div>

            <div>
              <h3 className="text-4xl font-black">$50K+</h3>

              <p className="mt-2">Paid to workers</p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-white/10 h-56 flex flex-col justify-between">
            <div className="text-5xl">🌍</div>

            <div>
              <h3 className="text-4xl font-black">25+</h3>

              <p className="text-slate-400 mt-2">Countries Connected</p>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-white/10 h-56 flex flex-col justify-between">
            <div className="text-5xl">⭐</div>

            <div>
              <h3 className="text-4xl font-black">4.9</h3>

              <p className="text-slate-400 mt-2">Average User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
