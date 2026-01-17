import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col space-y-4">
          <Link to="/admin/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
          <Link to="/admin/users" className="text-gray-700 hover:text-black">Users</Link>
          <Link to="/admin/orders" className="text-gray-700 hover:text-black">Orders</Link>
          <Link to="/admin/products" className="text-gray-700 hover:text-black">Products</Link>
          <Link to="/admin/pincodes" className="text-gray-700 hover:text-black">Manage Pincodes</Link>
          <Link to="/admin/tickets" className="text-gray-700 hover:text-black">Tickets</Link>


          <button
            onClick={logout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}