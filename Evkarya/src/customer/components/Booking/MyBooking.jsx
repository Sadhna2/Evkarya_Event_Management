import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        const res = await axios.get(`${API_URL}/api/bookings/user/${decoded.id}`);
        setBookings(res.data.bookings);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-purple-600">Loading your bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-20">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No bookings found.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{booking.productId.title}</h2>
              <p className="text-gray-600 mb-1">Price: ₹{booking.productId.discountedPrice}</p>
              <p className="text-gray-600 mb-1">Color: {booking.productId.color}</p>
              <p className="text-gray-600 mb-1">Size: {booking.productId.size.join(", ")}</p>
              <p className="text-gray-500 text-sm mt-3">Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
