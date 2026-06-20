export default function FAQSection() {
  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl font-black">FAQ</h2>

        <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
          Frequently asked questions about earning, tasks, and withdrawals
        </p>

        <div className="mt-12 space-y-6 text-left">
          {/* ITEM 1 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:shadow-lg transition">
            <h3 className="font-bold text-lg text-emerald-400">
              How do I earn coins?
            </h3>

            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Complete available micro tasks such as liking posts, surveys, and
              social engagement tasks to earn coins instantly.
            </p>
          </div>

          {/* ITEM 2 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:shadow-lg transition">
            <h3 className="font-bold text-lg text-emerald-400">
              How do I withdraw earnings?
            </h3>

            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Convert your earned coins into real money anytime using available
              payment methods like mobile banking or bank transfer.
            </p>
          </div>

          {/* ITEM 3 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:shadow-lg transition">
            <h3 className="font-bold text-lg text-emerald-400">
              Is this platform safe?
            </h3>

            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Yes, all transactions are secured using JWT authentication and
              verified payment systems.
            </p>
          </div>

          {/* ITEM 4 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:shadow-lg transition">
            <h3 className="font-bold text-lg text-emerald-400">
              Who can join this platform?
            </h3>

            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Anyone can join as a Worker or Buyer and start earning or posting
              tasks immediately after registration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
