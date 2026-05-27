// src/components/home/TestimonialsSection.jsx

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Rahim Uddin",
      review:
        "This platform helped me earn money online while learning digital skills.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    },
    {
      id: 2,
      name: "Mim Akter",
      review:
        "Very smooth task system and withdrawal process. Highly recommended.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    },
    {
      id: 3,
      name: "Sabbir Hossain",
      review:
        "Perfect platform for students who want side income from micro tasks.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black">What Users Say</h2>

          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            Trusted by thousands of users worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>

                  <p className="text-emerald-400">Verified User</p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                “{item.review}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
