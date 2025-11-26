import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; 

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Sedang masuk...");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      toast.dismiss(loadingToast);
      toast.success(`Selamat datang, ${res.data.username}!`);

      setUser(res.data);
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMsg = err.response && err.response.data
        ? err.response.data
        : "Login Gagal. Cek email dan password.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 text-3xl">
            ⚡
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">Selamat Datang</h2>
          <p className="text-gray-500 mt-2 text-sm">Masuk untuk mulai pesan makan tanpa antre</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="contoh@mahasiswa.its.ac.id"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none bg-gray-50 focus:bg-white"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none bg-gray-50 focus:bg-white"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition transform hover:-translate-y-0.5 shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "MASUK SEKARANG"}
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-emerald-600 font-bold hover:underline hover:text-emerald-700">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
