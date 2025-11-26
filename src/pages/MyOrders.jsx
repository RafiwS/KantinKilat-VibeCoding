import { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${user._id}`);
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    if(!confirm("Yakin mau membatalkan pesanan ini?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      alert("Pesanan dibatalkan.");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data || "Gagal membatalkan pesanan.");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Diproses': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Siap Diambil': return 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold animate-pulse';
      case 'Selesai': return 'bg-gray-100 text-gray-600 border border-gray-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">

      <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 py-4 z-10">
        <h2 className="text-2xl font-bold text-emerald-800">Riwayat Pesanan</h2>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 px-3 py-2 rounded-lg transition"
        >
          {loading ? "Memuat..." : "🔄 Refresh Status"}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 opacity-60">
            <div className="text-6xl mb-4">🧾</div>
            <p>Belum ada riwayat pesanan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

              <div className="flex justify-between items-start mb-3 border-b border-dashed pb-3">
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">ID: #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Total Bayar</p>
                    <p className="text-lg font-bold text-emerald-700">Rp {order.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700"><span className="font-bold text-emerald-600">{item.qty}x</span> {item.name}</span>
                  </div>
                ))}
              </div>

              {order.status === 'Pending' && (
                <div className="pt-3 border-t flex justify-end">
                    <button
                        onClick={() => handleCancel(order._id)}
                        className="text-red-500 text-sm font-semibold hover:bg-red-50 px-3 py-1 rounded transition border border-red-200"
                    >
                        ❌ Batalkan Pesanan
                    </button>
                </div>
              )}

              {order.status === 'Siap Diambil' && (
                  <div className="bg-emerald-50 text-emerald-800 text-center text-sm font-bold p-2 rounded-lg border border-emerald-100">
                      🔔 Makanan sudah siap! Silakan ambil di kantin.
                  </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
