import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">

      <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">

            <div className="flex items-center gap-1 md:gap-2">
               <span className="text-2xl md:text-3xl">⚡</span>
               <div className="flex flex-col md:flex-row md:items-center">
                   <span className="text-lg md:text-xl font-bold tracking-wide text-emerald-800">KantinKilat</span>
                   <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full w-fit mt-1 md:mt-0 md:ml-2 text-center">ITS</span>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Link to="/login" className="text-sm font-semibold text-emerald-700 hover:text-emerald-500 transition hidden sm:block">
                    Masuk
                </Link>
                <Link to="/register" className="bg-emerald-600 text-white text-xs md:text-sm px-4 py-2 rounded-full font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-200 whitespace-nowrap">
                    Daftar Sekarang
                </Link>
            </div>
        </div>
      </nav>

      <header className="container mx-auto px-4 pt-8 pb-20 md:py-20 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-0">

        <div className="w-full md:w-1/2 text-center md:text-left z-10">
            <h1 className="text-3xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-6">
                Perut Lapar,<br/>
                <span className="text-emerald-600">Gak Pakai Antre.</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-500 mb-8 leading-relaxed px-2 md:px-0">
                Solusi cerdas mahasiswa ITS. Pesan makanan dari kelas, bayar pakai QRIS, ambil saat matang. Hemat waktu, kenyang maksimal.
            </p>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center md:justify-start w-full md:w-auto">
                <Link to="/register" className="w-full md:w-auto bg-emerald-600 text-white px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-emerald-700 transition shadow-lg hover:shadow-xl active:scale-95">
                    Mulai Pesan
                </Link>
                <Link to="/login" className="w-full md:w-auto bg-white text-emerald-700 border-2 border-emerald-100 px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:border-emerald-600 hover:bg-emerald-50 transition active:scale-95">
                    Sudah Punya Akun?
                </Link>
            </div>

            <div className="mt-8 md:mt-10 flex items-center justify-center md:justify-start gap-4 md:gap-6 text-gray-400 text-xs md:text-sm font-semibold uppercase tracking-widest">
                <span className="flex items-center gap-1">Cepat</span>
                <span className="flex items-center gap-1">Aman</span>
                <span className="flex items-center gap-1">Praktis</span>
            </div>
        </div>

        <div className="w-full md:w-1/2 relative flex justify-center">
            <div className="absolute top-10 left-10 bg-emerald-200 w-40 h-40 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
            <div className="absolute top-10 right-10 bg-yellow-200 w-40 h-40 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>

            <img
                src="https://img.freepik.com/free-vector/ordering-food-concept-illustration_114360-7366.jpg?t=st=1732600000~exp=1732603600~hmac=a1b2c3d4"
                alt="Ilustrasi Pesan Makan"
                className="relative z-10 w-3/4 md:w-full max-w-sm md:max-w-lg drop-shadow-xl rounded-2xl"
            />
        </div>

      </header>

      <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-gray-400 text-xs md:text-sm">
        <p>&copy; 2024 KantinKilat ITS - Vibe Coding Project.</p>
      </footer>

    </div>
  );
}
