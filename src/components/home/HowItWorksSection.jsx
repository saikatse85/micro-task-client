// src/components/home/HowItWorksSection.jsx

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black">How It Works</h2>

          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            Start earning in just 3 simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl mb-6">
              👤
            </div>

            <h3 className="text-3xl font-bold mb-4">Create Account</h3>

            <p className="text-slate-400 leading-relaxed">
              Register as a Worker or Buyer and receive free coins instantly.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl mb-6">
              📋
            </div>

            <h3 className="text-3xl font-bold mb-4">Complete Tasks</h3>

            <p className="text-slate-400 leading-relaxed">
              Accept tasks, submit proof, and get approval from buyers.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl mb-6">
              💸
            </div>

            <h3 className="text-3xl font-bold mb-4">Withdraw Earnings</h3>

            <p className="text-slate-400 leading-relaxed">
              Convert coins into real money using multiple payment methods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
