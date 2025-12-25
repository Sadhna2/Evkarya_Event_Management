import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { product, user } = location.state || {};

  const handleConfirmBooking = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/bookings`, {
        productId: product._id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });
      console.log(res.data);
      alert("Booking Successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to place booking.");
    }
  };

  if (!product || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-red-500">No Booking Information Found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-20">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Checkout Details</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
            <p className="text-gray-600 mt-2">Name: {user.name}</p>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Product Information</h2>
            <p className="text-gray-600 mt-2">Title: {product.title}</p>
            <p className="text-gray-600">Price: ₹{product.discountedPrice}</p>
            <p className="text-gray-600">Color: {product.color}</p>
            <p className="text-gray-600">Size: {product.size.join(", ")}</p>
          </div>

          <button
            onClick={handleConfirmBooking}
            className="mt-6 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
