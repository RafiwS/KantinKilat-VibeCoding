import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard({ user }) {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [proof, setProof] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedKantin, setSelectedKantin] = useState(null);
  const [kantinQris, setKantinQris] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/menu");
        if(res.data.length === 0) {
           await axios.post("http://localhost:5000/api/menu/seed");
           window.location.reload();
        } else {
           setMenus(res.data);
        }
      } catch (err) { console.error(err); }
    };
    fetchMenu();
  }, []);

  const activeKantin = selectedKantin || (cart.length > 0 ? cart[0].kantin : null);

  useEffect(() => {
    if (activeKantin) {
      const fetchQris = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/auth/kantin/${activeKantin}`);
          setKantinQris(res.data.qrisImage);
        } catch (err) {
          setKantinQris(null);
        }
      };
      fetchQris();
    } else {
      setKantinQris(null);
    }
  }, [activeKantin]);

  const uniqueKantins = [...new Set(menus.map(item => item.kantin))];

  const filteredMenus = menus.filter(menu => {
    const matchKantin = selectedKantin ? menu.kantin === selectedKantin : true;
    const matchSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKantin && matchSearch;
  });

  const addToCart = (item) => {
    const existing = cart.find(c => c._id === item._id);
    if (existing) {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      if (cart.length > 0 && cart[0].kantin !== item.kantin) {
        if(!confirm("Ganti kantin? Menu sebelumnya akan dihapus.")) return;
        setCart([{ ...item, qty: 1 }]);
      } else {
        setCart([...cart, { ...item, qty: 1 }]);
      }
    }
  };

  const decreaseCart = (item) => {
    const existing = cart.find(c => c._id === item._id);
    if (existing.qty === 1) {
      setCart(cart.filter(c => c._id !== item._id));
    } else {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty - 1 } : c));
    }
  };

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!proof) return toast.error("Wajib upload bukti bayar!");

    setIsOrdering(true);
    const loadingToast = toast.loading("Mengirim pesanan...");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("totalPrice", total);
    formData.append("paymentProof", proof);

    const itemsData = cart.map(c => ({
        menuId: c._id,
        name: c.name,
        price: c.price,
        qty: c.qty
    }));
    formData.append("items", JSON.stringify(itemsData));

    try {
      await axios.post("http://localhost:5000/api/orders", formData);
      toast.dismiss(loadingToast);
      toast.success("Pesanan Berhasil! Cek tab 'Pesanan'.");
      setCart([]);
      setProof(null);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Gagal memesan. Coba lagi.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3">

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {!selectedKantin ? (
                 <h2 className="text-2xl font-bold text-emerald-800">Pilih Kantin / Stand</h2>
            ) : (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSelectedKantin(null)}
                        className="bg-white border hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                    >
                        ← Kembali
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 truncate">{selectedKantin}</h2>
                </div>
            )}

            <input
                type="text"
                placeholder="🔍 Cari menu..."
                className="w-full md:w-64 p-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {!selectedKantin && !searchTerm && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {uniqueKantins.map((kantinName, idx) => {
                const coverImage = menus.find(m => m.kantin === kantinName)?.image || "https://placehold.co/200x200?text=Kantin";
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedKantin(kantinName)}
                    className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1 border border-emerald-100 group flex flex-col items-center justify-center text-center"
                  >
                    <div className="h-16 w-16 md:h-24 md:w-24 bg-emerald-100 rounded-full mb-3 flex items-center justify-center text-2xl md:text-4xl group-hover:bg-emerald-200 transition">
                      🏪
                    </div>
                    <h3 className="font-bold text-sm md:text-xl text-gray-800 line-clamp-2">{kantinName}</h3>
                  </div>
                );
              })}
            </div>
        )}

        {(selectedKantin || searchTerm) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenus.length === 0 ? (
                  <div className="col-span-full text-center py-10 text-gray-500 italic">Menu tidak ditemukan.</div>
              ) : filteredMenus.map(menu => (
                <div key={menu._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex sm:block gap-4 group">
                  <img src={menu.image} alt={menu.name} className="w-24 h-24 sm:w-full sm:h-32 object-cover rounded-md flex-shrink-0 group-hover:scale-105 transition duration-300" />
                  <div className="flex flex-col justify-between w-full mt-2">
                    <div>
                      <h3 className="font-bold text-base text-gray-800 line-clamp-2">{menu.name}</h3>
                      <p className="text-emerald-600 font-bold text-sm">Rp {menu.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 mt-1">{menu.kantin}</p>
                    </div>
                    <button onClick={() => addToCart(menu)} className="mt-2 w-full bg-emerald-100 text-emerald-800 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-200 transition">+ Pesan</button>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>

      <div className="w-full md:w-1/3">
        <div className="bg-white p-5 rounded-xl shadow-lg sticky top-24 border border-emerald-50">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Keranjang Makan</h2>
          {cart.length === 0 ? <p className="text-gray-500 text-sm">Belum ada menu dipilih</p> : (
            <div className="space-y-3">
              <div className="max-h-60 overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm mb-3 bg-gray-50 p-2 rounded-lg">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => decreaseCart(item)} className="bg-gray-200 text-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-red-100 hover:text-red-600 font-bold">-</button>
                        <span className="font-bold text-emerald-700 w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded flex items-center justify-center hover:bg-emerald-200 font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-emerald-700">
                <span>Total</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>

              <form onSubmit={handleCheckout} className="mt-4 space-y-3">
                <div className="bg-white border-2 border-dashed border-emerald-200 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-2">Scan QRIS di bawah ini:</p>
                  {kantinQris ? (
                    <img src={kantinQris} alt="QRIS Kantin" className="w-32 h-32 mx-auto object-cover rounded-md mb-2" />
                  ) : (
                    <div className="w-full py-6 bg-gray-50 flex flex-col items-center justify-center rounded-md text-gray-400 border border-gray-200">
                       <span className="text-2xl">📵</span>
                       <span className="text-xs mt-2">QRIS Belum Diupload Penjual</span>
                       <span className="text-[10px] mt-1 text-gray-400">(Bayar Tunai di Kasir)</span>
                    </div>
                  )}
                  {activeKantin && <p className="font-bold text-emerald-800 text-xs mt-2">{activeKantin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 mt-2">Upload Bukti Transfer</label>
                  <input type="file" onChange={e => setProof(e.target.files[0])} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" required />
                </div>
                <button disabled={isOrdering} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition disabled:bg-gray-400">
                  {isOrdering ? "Memproses..." : "BAYAR SEKARANG"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
