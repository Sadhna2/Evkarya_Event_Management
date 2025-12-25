import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      return navigate('/login');
    }

    const fetchCart = async () => {
      try {
        const decoded = jwtDecode(token);
      console.log("Decoded user:", decoded);
        const res = await axios.get(`${API_URL}/api/cart/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.cart);
      } catch (err) {
        console.error("Failed to fetch cart", err);
        alert("Error loading cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(`${API_URL}/api/cart/update-item/${itemId}`, { quantity: newQty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart((prev) => ({
        ...prev,
        items: prev.items.map(item => item._id === itemId ? { ...item, quantity: newQty } : item)
      }));
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/remove-item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId)
      }));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const totalAmount = cart?.items.reduce((total, item) => total + item.price * item.quantity, 0) || 0;

  if (loading) return <div className="text-center pt-20 text-purple-600">Loading cart...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>
      {cart?.items.length === 0 ? (
  <div className="flex flex-col items-center justify-center mt-24 text-gray-600">
    <p className="text-xl font-medium">Your cart is empty.</p>
    <Link to="/products" className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
      Continue booking
    </Link>
  </div>
) : (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
          {cart.items.map((item) => (
            <div key={item._id} className="flex items-center justify-between gap-4 border-b pb-4">
              <Link to={`/product/${item.productId._id}`} className="flex items-center gap-4 flex-1">
                <img
                  src={item.productId.image}
                  alt={item.productId.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.productId.title}</h3>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 bg-gray-200 rounded">−</button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
              </div>

              <button onClick={() => removeItem(item._id)} className="text-red-500 hover:underline">Remove</button>
            </div>
          ))}
          <div className="text-right font-bold text-lg">Total: ₹{totalAmount.toFixed(2)}</div>
          <div className="text-right">
            <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
