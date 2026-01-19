import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative min-h-screen animated-light flex flex-col justify-center items-center px-6 text-gray-900 overflow-hidden">

      {/* Floating pastel shapes */}
      <div className="absolute top-10 left-10 w-52 h-52 bg-pink-300 rounded-full blur-[90px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-300 rounded-full blur-[110px] opacity-60 animate-ping"></div>

      {/* HERO GLASS CARD */}
      <div className="glass-box p-12 rounded-3xl shadow-2xl text-center max-w-2xl backdrop-blur-xl border border-white/50 mt-10">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
          Smart Mess Platform
        </h1>

        <p className="text-lg mb-10 opacity-90 leading-relaxed">
          A modern solution to avoid food wastage in hostels by tracking daily attendance and preparing food smartly.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="px-8 py-3 text-lg rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:scale-110 transition-all"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-8 py-3 text-lg rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold shadow-lg hover:scale-110 transition-all"
          >
            Register
          </Link>
        </div>
      </div>

      {/* FEATURES SECTION */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">

        <div className="glass-box p-6 rounded-2xl text-center shadow-xl hover:scale-110 transition-transform border border-white/40">
          <div className="text-5xl mb-4 text-pink-600 animate-bounce">🍽️</div>
          <h3 className="text-2xl font-bold mb-3">Reduce Food Waste</h3>
          <p className="opacity-90">Prepare meals based on accurate real-time numbers and avoid unnecessary wastage.</p>
        </div>

        <div className="glass-box p-6 rounded-2xl text-center shadow-xl hover:scale-110 transition-transform border border-white/40">
          <div className="text-5xl mb-4 text-blue-600 animate-bounce">📊</div>
          <h3 className="text-2xl font-bold mb-3">Real-Time Attendance</h3>
          <p className="opacity-90">Students mark daily attendance; admins can view exact counts anytime.</p>
        </div>

        <div className="glass-box p-6 rounded-2xl text-center shadow-xl hover:scale-110 transition-transform border border-white/40">
          <div className="text-5xl mb-4 text-purple-600 animate-bounce">⚙️</div>
          <h3 className="text-2xl font-bold mb-3">Efficient Management</h3>
          <p className="opacity-90">Approve requests & manage mess operations easily with one dashboard.</p>
        </div>

        </div>

      {/* FOOTER */}
        <footer className="mt-16 mb-8 text-center opacity-90">
          <div className="flex justify-center gap-6 text-3xl mb-4">
            <a href="#" className="hover:scale-110 transition-transform">🌐</a>
            <a href="#" className="hover:scale-110 transition-transform">📧</a>
            <a href="#" className="hover:scale-110 transition-transform">💼</a>
          </div>

          <p className="text-lg font-semibold">
            © 2025 Smart Mess Platform. All rights reserved.
          </p>
          <p className="text-sm mt-2">
            Built with ❤️ for students | Reduce food waste, build a better future.
          </p>
        </footer>

    </div>
  );
}

export default Home;
