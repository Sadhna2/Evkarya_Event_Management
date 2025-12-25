import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./customer/components/Navigation/Navigation.jsx";
import AdminRouters from "./routers/AdminRouter.jsx";
import HomePage from "./customer/pages/HomePage/HomePage.jsx";
import Product from "./customer/components/Product/Product.jsx";
import Footer from "./customer/components/Footer/Footer.jsx";
import ProductDetail from './customer/components/ProductDetails/ProductDetail.jsx';

import CategoryPage from './customer/pages/HomePage/CategoryPage.jsx';
import VendorProfile from "./customer/pages/HomePage/VendorProfile.jsx";
import Checkout from './customer/components/Checkout/Checkout.jsx';
import MyBookings from './customer/components/Booking/MyBooking.jsx';
import Login from "./login/login.jsx";
import Register from "./login/register.jsx";


const Navbar = () => {
  return (
    <div className="fixed pb-0 top-0 left-0 w-full z-50 bg-white shadow-md ">
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
       

       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/vendor/:id/*" element={<AdminRouters />} />

   
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Product />} />
        <Route path="/footer" element={<Footer />} />

    
        <Route path="/category/:categoryName" element={<CategoryPage />} />

  
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/vendor/:vendorId" element={<VendorProfile />} />

       

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/mybookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
