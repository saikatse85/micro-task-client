// src/components/home/TopWorkersSection.jsx

export default function TopWorkersSection() {
  const topWorkers = [
    {
      id: 1,
      name: "Shakib Hasan",
      coins: 5200,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    },
    {
      id: 2,
      name: "Nusrat Jahan",
      coins: 4800,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    },
    {
      id: 3,
      name: "Tamim Iqbal",
      coins: 4500,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
    },
    {
      id: 4,
      name: "Ayesha Rahman",
      coins: 4300,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    },
    {
      id: 5,
      name: "Mahin Ahmed",
      coins: 4100,
      image:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=400",
    },
    {
      id: 6,
      name: "Sadia Islam",
      coins: 3900,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black">Top Workers</h2>

          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            Meet our highest earning workers on the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 hover:-translate-y-2 transition duration-300"
            >
              <div className="flex items-center gap-4">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500"
                />

                <div>
                  <h3 className="text-2xl font-bold">{worker.name}</h3>

                  <p className="text-emerald-400 mt-1">{worker.coins} Coins</p>
                </div>
              </div>

              <div className="mt-6 bg-gray-100 dark:bg-slate-900 rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Task Success</span>

                  <span>95%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                  <div className="bg-emerald-500 h-3 rounded-full w-[95%]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
