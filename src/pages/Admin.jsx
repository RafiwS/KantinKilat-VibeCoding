import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Admin() {
  const [sellers, setSellers] = useState([]);

  const fetchPendingSellers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/pending-sellers");
      setSellers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleVerify = async (id, name) => {
    if(!confirm(`Yakin verifikasi ${name}?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/auth/verify-user/${id}`);
      toast.success(`Berhasil memverifikasi ${name}`);
      fetchPendingSellers();
    } catch (err) {
      toast.error("Gagal verifikasi");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            👮‍♂️ Dashboard Admin ITS
        </h2>

        {sellers.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Tidak ada pendaftar penjual baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 rounded-tl-lg">Nama</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 rounded-tr-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sellers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-800">{user.username}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">
                            Pending
                        </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleVerify(user._id, user.username)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-md hover:shadow-lg transition transform active:scale-95"
                      >
                        ✅ Verifikasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
