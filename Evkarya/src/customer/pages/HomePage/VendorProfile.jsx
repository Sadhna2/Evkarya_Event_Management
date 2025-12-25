import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail } from "lucide-react";

const VendorProfile = () => {
 const API_URL = process.env.REACT_APP_API_URL;
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vendors/${vendorId}/bio`);
        setVendor(res.data.vendor);
      } catch (err) {
        setError("Failed to fetch vendor details.");
      }
    };

    const fetchVendorProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/vendor/${vendorId}`);
setProducts(res.data.data || []);

      } catch (err) {
        console.error("Error fetching vendor products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
    fetchVendorProducts();
  }, [vendorId]);

  if (loading) return <div className="text-center pt-20 text-purple-600">Loading Vendor Details...</div>;
  if (error) return <div className="text-center pt-20 text-red-500">{error}</div>;
  if (!vendor) return null;

  return (
    <div className="min-h-screen pt-24 px-6 md:px-20 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-6">
        {/* Vendor Info */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-purple-700">{vendor.name}</h1>
        </div>

        {/* Email */}
        <div className="flex items-center text-gray-600 gap-2">
          <Mail className="w-5 h-5" />
          <span>{vendor.email}</span>
        </div>

        {/* Bio */}
        {vendor.bio && (
          <p className="text-gray-700 text-lg mt-4">
            {vendor.bio}
          </p>
        )}

        {/* Availability */}
        <div className="mt-4">
          <span
            className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${
              vendor.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {vendor.availability ? "Available Today" : "Not Available Today"}
          </span>
        </div>

        {/* Categories */}
        {vendor.categories && vendor.categories.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Categories</h2>
            <div className="flex flex-wrap gap-3">
              {vendor.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/*  Vendor Products Section */}
        {products.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Products by {vendor.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition-all p-4"
                >
                  <img
  src={product.imageUrl || "/placeholder.jpg"}
  alt={product.name}
  className="w-full h-40 object-contain rounded-md mb-4"
/>

                  <h3 className="text-lg font-semibold text-purple-700">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.description?.substring(0, 60)}...</p>
                  <div className="text-purple-800 font-bold mt-2">₹{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;
