import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Seller() {
  const [activeTab, setActiveTab] = useState("menu");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);

  const [formMenu, setFormMenu] = useState({
    id: null,
    name: "",
    price: "",
    category: "Makanan",
    imageFile: null
  });

  const [shopProfile, setShopProfile] = useState({
    kantinName: user.kantinName || "",
    kantinLocation: user.kantinLocation || "Kantin Pusat",
    qrisFile: null
  });

  const kantinList = [
    "Kantin Pusat", "Kantin Biologi", "Kantin Teknik Mesin",
    "Kantin Teknik Fisika", "Kantin Teknik Informatika",
    "Kantin Studi Pembangunan", "Kantin Perpustakaan", "Kantin Teknik Geomatika"
  ];

  useEffect(() => {
    if (user && user.kantinName) {
        fetchMenus();
        fetchOrders();
    }
  }, [user]);

  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      if(user.kantinName) {
        setMenus(res.data.filter(m => m.kantin === user.kantinName));
      }
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      if(user.kantinName) {
        const myOrders = res.data.filter(order =>
          order.items.some(item => item.menuId && item.menuId.kantin === user.kantinName)
        );
        setOrders(myOrders);
      }
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
        toast.success("Status pesanan diupdate!");
        fetchOrders();
    } catch (err) {
        toast.error("Gagal update status");
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if(!user.kantinName) return toast.error("Isi Nama Kantin dulu di Tab Pengaturan!");

    const loading = toast.loading("Menyimpan menu...");
    const formData = new FormData();
    formData.append("name", formMenu.name);
    formData.append("price", formMenu.price);
    formData.append("category", formMenu.category);
    formData.append("kantin", user.kantinName);
    if(formMenu.imageFile) {
        formData.append("image", formMenu.imageFile);
    }

    try {
      if (formMenu.id) {
        await axios.put(`http://localhost:5000/api/menu/${formMenu.id}`, formData);
        toast.success("Menu Berhasil Diupdate!");
      } else {
        await axios.post("http://localhost:5000/api/menu", formData);
        toast.success("Menu Berhasil Ditambah!");
      }
      setFormMenu({ id: null, name: "", price: "", category: "Makanan", imageFile: null });
      document.getElementById("menuFileInput").value = "";
      fetchMenus();
    } catch (err) { toast.error("Gagal simpan menu. Cek koneksi."); }
    finally { toast.dismiss(loading); }
  };

  const handleDelete = async (id) => {
    if(confirm("Yakin hapus menu ini?")) {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      toast.success("Menu dihapus.");
      fetchMenus();
    }
  };

  const handleEdit = (menu) => {
    setFormMenu({
        id: menu._id,
        name: menu.name,
        price: menu.price,
        category: menu.category,
        imageFile: null
    });
    window.scrollTo(0,0);
    toast("Mode Edit Aktif. Silakan ubah form di kiri.", { icon: '✏️' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const loading = toast.loading("Menyimpan profil...");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("kantinName", shopProfile.kantinName);
    formData.append("kantinLocation", shopProfile.kantinLocation);
    if(shopProfile.qrisFile) {
        formData.append("qrisImage", shopProfile.qrisFile);
    }

    try {
      const res = await axios.put("http://localhost:5000/api/auth/update-profile", formData);

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      toast.success("Profil & QRIS Disimpan!");
    } catch (err) { toast.error("Gagal update profil"); }
    finally { toast.dismiss(loading); }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden min-h-[80vh]">

      <div className="bg-emerald-800 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold">🏪 Dashboard Penjual</h1>
            <p className="text-emerald-200 text-sm">Kelola menu dan pesanan dengan mudah</p>
        </div>
        <div className="flex gap-2 text-sm font-semibold">
          <button onClick={() => setActiveTab("menu")} className={`px-4 py-2 rounded-full transition ${activeTab === "menu" ? "bg-white text-emerald-800 shadow" : "bg-emerald-700/50 hover:bg-emerald-700"}`}>Menu Saya</button>
          <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 rounded-full transition ${activeTab === "orders" ? "bg-white text-emerald-800 shadow" : "bg-emerald-700/50 hover:bg-emerald-700"}`}>Pesanan Masuk</button>
          <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 rounded-full transition ${activeTab === "settings" ? "bg-white text-emerald-800 shadow" : "bg-emerald-700/50 hover:bg-emerald-700"}`}>Pengaturan</button>
        </div>
      </div>

      <div className="p-4 md:p-8 bg-gray-50/50">

        {activeTab === "menu" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 h-fit sticky top-4 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-emerald-800 border-b pb-2">{formMenu.id ? "Edit Menu" : "Tambah Menu Baru"}</h3>
              <form onSubmit={handleMenuSubmit} className="space-y-4">
                <input type="text" placeholder="Nama Menu" className="w-full p-2 border rounded bg-gray-50 focus:bg-white transition" value={formMenu.name} onChange={e => setFormMenu({...formMenu, name: e.target.value})} required />
                <input type="number" placeholder="Harga (Rp)" className="w-full p-2 border rounded bg-gray-50 focus:bg-white transition" value={formMenu.price} onChange={e => setFormMenu({...formMenu, price: e.target.value})} required />
                <select className="w-full p-2 border rounded bg-gray-50 focus:bg-white transition" value={formMenu.category} onChange={e => setFormMenu({...formMenu, category: e.target.value})}>
                  <option>Makanan</option><option>Minuman</option><option>Snack</option>
                </select>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                    <input
                        id="menuFileInput"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => setFormMenu({...formMenu, imageFile: e.target.files[0]})}
                    />
                    <div className="text-sm text-gray-500">
                        {formMenu.imageFile ? (
                            <span className="text-emerald-600 font-semibold">📸 {formMenu.imageFile.name}</span>
                        ) : (
                            <>📸 Klik untuk upload foto menu</>
                        )}
                    </div>
                </div>

                <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition">{formMenu.id ? "Update Menu" : "Simpan Menu"}</button>
                {formMenu.id && <button type="button" onClick={() => setFormMenu({id:null, name:"", price:"", category:"Makanan", imageFile:null})} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-2 font-semibold">Batal Edit</button>}
              </form>
            </div>

            <div className="md:col-span-2">
                 {menus.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400">Belum ada menu. Tambahkan di form sebelah kiri.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {menus.map(menu => (
                            <div key={menu._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-40 overflow-hidden relative">
                                <img src={menu.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={menu.name} />
                                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">{menu.category}</div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-gray-800 line-clamp-1">{menu.name}</h4>
                                <p className="text-emerald-600 font-bold">Rp {menu.price.toLocaleString()}</p>
                                <div className="mt-4 flex gap-2">
                                    <button onClick={() => handleEdit(menu)} className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-100">Edit</button>
                                    <button onClick={() => handleDelete(menu._id)} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100">Hapus</button>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h3 className="font-bold text-xl mb-6 text-gray-800">Daftar Pesanan Masuk</h3>
            {orders.length === 0 ? <p className="text-gray-500">Belum ada pesanan masuk.</p> : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white">
                    <div className="flex justify-between border-b pb-2 mb-2">
                      <div>
                        <span className="font-bold text-emerald-800">#{order._id.slice(-6)}</span>
                        <span className="text-gray-500 text-sm ml-2">oleh {order.userId ? order.userId.username : 'Anonim'}</span>
                      </div>

                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === 'Selesai' ? 'bg-gray-200 text-gray-600' :
                        order.status === 'Siap Diambil' ? 'bg-green-100 text-green-800 animate-pulse' :
                        order.status === 'Diproses' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <ul className="text-sm space-y-1">
                          {order.items.map((item, i) => (
                             item.menuId && item.menuId.kantin === user.kantinName && (
                              <li key={i} className="flex justify-between">
                                <span>{item.qty}x {item.name}</span>
                                <span>Rp {(item.price * item.qty).toLocaleString()}</span>
                              </li>
                             )
                          ))}
                        </ul>
                      </div>
                      <div className="w-32 text-center">
                         <p className="text-xs text-gray-500 mb-1">Bukti Bayar</p>
                         {order.paymentProof ? (
                           <a href={`http://localhost:5000/uploads/${order.paymentProof}`} target="_blank" className="text-blue-600 text-xs underline">Lihat Foto</a>
                         ) : <span className="text-red-500 text-xs">Tidak ada</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2 pt-2 border-t justify-end">
                        {order.status === 'Pending' && (
                            <button onClick={() => updateStatus(order._id, 'Diproses')} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Terima & Masak</button>
                        )}
                        {order.status === 'Diproses' && (
                            <button onClick={() => updateStatus(order._id, 'Siap Diambil')} className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700">Makanan Siap</button>
                        )}
                        {order.status === 'Siap Diambil' && (
                            <button onClick={() => updateStatus(order._id, 'Selesai')} className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Pesanan Selesai</button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-xl mb-6 text-center text-emerald-800">Identitas Kantin & QRIS</h3>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-sm text-yellow-800">
              ⚠️ Wajib diisi agar menu kamu muncul di aplikasi pembeli.
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Kantin / Stand</label>
                <input type="text" className="w-full p-3 border rounded focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Kantin Bu Yuli" value={shopProfile.kantinName} onChange={e => setShopProfile({...shopProfile, kantinName: e.target.value})} required />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Lokasi Kantin</label>
                <select
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={shopProfile.kantinLocation}
                  onChange={e => setShopProfile({...shopProfile, kantinLocation: e.target.value})}
                >
                  {kantinList.map((k, idx) => (
                    <option key={idx} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Upload QRIS</label>
                {user.qrisImage && <p className="text-xs text-green-600 mb-2 bg-green-50 p-1 rounded inline-block">✅ QRIS Tersimpan</p>}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => setShopProfile({...shopProfile, qrisFile: e.target.files[0]})}
                        accept="image/*"
                    />
                    <div className="text-sm text-gray-500">
                        {shopProfile.qrisFile ? (
                            <span className="text-emerald-600 font-semibold">📸 {shopProfile.qrisFile.name}</span>
                        ) : (
                            <>📷 Klik untuk upload gambar QRIS</>
                        )}
                    </div>
                </div>
              </div>

              <button className="w-full bg-emerald-800 text-white font-bold py-3 rounded-lg hover:bg-emerald-900 transition shadow-lg mt-4">SIMPAN PENGATURAN</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
