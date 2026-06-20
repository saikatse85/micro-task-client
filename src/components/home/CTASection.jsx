import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-black">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-black leading-tight">
          Ready to Start Your Earning Journey?
        </h2>

        <p className="text-xl mt-6 opacity-80 max-w-3xl mx-auto">
          Join our platform today and begin completing tasks to earn coins and
          real money.
        </p>

        <Link href="/login">
          <button className="mt-10 bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition duration-300">
            Join Now
          </button>
        </Link>
      </div>
    </section>
  );
}
