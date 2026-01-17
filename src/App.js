import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import ProductsList from "./components/ProductsList/ProductsList";
import ProductPage from "./components/ProductPage/ProductPage";
import SignUp from "./components/pages/SignUp";
import LogIn from "./components/pages/LogIn";
import Favourites from "./components/pages/Favourites";
import Cart from "./components/pages/Cart";
import HelpDesk from "./components/pages/HelpDesk";
import MailUs from "./components/pages/MailUs";
import About from "./components/pages/About";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
//import Orders from "./components/pages/Orders";
import Checkout from "./components/pages/Checkout";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminOrders from "./components/admin/AdminOrders";
import AdminProducts from "./components/admin/AdminProducts";
import AdminLogin from "./components/admin/AdminLogin";
import AdminAddProduct from "./components/admin/AdminAddProduct";
import AdminEditProduct from "./components/admin/AdminEditProduct";
import AdminPincodes from "./components/admin/AdminPincodes";
import AdminOrderDetail from "./components/admin/AdminOrderDetail";
import MyOrdersWithTimeline from "./components/pages/MyOrdersWithTimeline";
import OrderSuccess from "./components/pages/OrderSuccess";
import OrderTracking from "./components/pages/OrderTracking";
import OrderDetails from "./components/pages/OrderDetails";
import SupportWidget from "./components/support/SupportWidget";
import AdminTickets from "./components/admin/AdminTickets";
import Home from "./components/pages/Home";


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {!window.location.pathname.startsWith("/admin") && <Navbar />}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Pages */}
        <Route path="/products" element={<ProductsList />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/favourites" element={ 
          <ProtectedRoute> 
            <Favourites />
             </ProtectedRoute>} 
             />
        <Route path="/cart" element={
          <ProtectedRoute>
             <Cart />
             </ProtectedRoute>} 
             />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={
          <ProtectedRoute>
             <MyOrdersWithTimeline />
             </ProtectedRoute>
            } />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /> </ProtectedRoute>} />
        <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/order/:id/tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

        <Route path="/helpdesk" element={<HelpDesk />} />
        <Route path="/mailus" element={<MailUs />} />
        <Route path="/about" element={<About />} />

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>}/>
        <Route path="/admin/pincodes" element={<AdminRoute> <AdminPincodes /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
        <Route path="/admin/tickets"element={<AdminRoute> <AdminTickets /></AdminRoute>}/>
      </Routes>

      {/* GLOBAL FOOTER */}
      <SupportWidget />
      <Footer />

    </div>
  );
}

export default App;