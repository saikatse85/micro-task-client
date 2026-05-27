// src/components/home/ExtraStepsSection.jsx

export default function ExtraStepsSection() {
  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-black">How It Works</h2>

        <p className="text-slate-600 dark:text-slate-400 mt-4">
          Simple 3 step earning system
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {["Register", "Complete Tasks", "Earn Money"].map((step, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-200 dark:border-white/10"
            >
              <h3 className="text-2xl font-bold text-emerald-400">
                Step {i + 1}
              </h3>

              <p className="mt-4 text-lg">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
