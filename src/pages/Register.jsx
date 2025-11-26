import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", { username, email, password, role });
      navigate("/login");
    } catch (err) {
      alert("Gagal Mendaftar. Email mungkin sudah dipakai.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-emerald-800 mb-6">Daftar Akun Baru</h2>
        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setUsername(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setPassword(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Daftar Sebagai</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="mahasiswa">Mahasiswa (Pembeli)</option>
              <option value="penjual">Penjual Kantin</option>
            </select>
          </div>

          <button className="w-full bg-emerald-600 text-white py-3 rounded font-bold hover:bg-emerald-700 transition">DAFTAR</button>
        </form>
        <p className="mt-4 text-center">Sudah punya akun? <Link to="/login" className="text-emerald-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
}
