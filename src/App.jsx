import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyOrders from "./pages/MyOrders";
import Seller from "./pages/Seller";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20 md:pb-0">

        {user && (
          <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">

              <Link to="/" className="text-lg md:text-xl font-bold tracking-wide flex items-center gap-1 hover:text-emerald-100 transition">
                ⚡ <span className="hidden sm:inline">KantinKilat</span>
                <span className="sm:hidden">Kantin</span>
              </Link>

              <div className="flex items-center gap-3 md:gap-6 text-sm md:text-base">

                <Link to="/" className="hover:text-emerald-200 font-medium transition">Menu</Link>
                <Link to="/orders" className="hover:text-emerald-200 font-medium transition">Pesanan</Link>

                {user.role === 'penjual' && (
                  <Link to="/seller" className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 px-2 py-1 rounded-lg font-medium transition flex items-center gap-1 shadow-sm whitespace-nowrap">
                    👨‍🍳 <span className="hidden sm:inline">Jualan</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="bg-emerald-800 px-3 py-1 rounded-lg hover:bg-red-600 transition border border-emerald-600 shadow-sm text-xs md:text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}

        <div className={user ? "container mx-auto px-4 py-4 md:py-6" : ""}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={user ? <Dashboard user={user} /> : <Landing />} />
            <Route path="/orders" element={user ? <MyOrders user={user} /> : <Navigate to="/login" />} />
            <Route path="/seller" element={user && user.role === 'penjual' ? <Seller /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
