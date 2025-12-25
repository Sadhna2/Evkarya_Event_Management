import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ProductDetail = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

 
  const [hasUserOrder, setHasUserOrder] = useState(false);
  const [userOrderStatus, setUserOrderStatus] = useState(null);
  const [bookedByOther, setBookedByOther] = useState(false);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    eventDate: "",
    eventLocation: "",
    requirements: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${id}`);
        setPost(res.data.post);
      } catch {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, API_URL]);

  
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        setUserInfo(jwtDecode(token));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    axios
      .get(`${API_URL}/api/orders/post/${id}/user/${userInfo.id}`)
      .then((res) => {
        setHasUserOrder(res.data.hasUserOrder);
        setUserOrderStatus(res.data.userOrderStatus);
        setBookedByOther(res.data.postBookedBySomeoneElse);
      })
      .catch(() => {});
  }, [userInfo, id, API_URL]);

  const handleBookNow = () => {
    if (!userInfo) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const { phoneNumber, eventDate, eventLocation, requirements } = formData;

    if (!phoneNumber || !eventDate || !eventLocation) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setBookingLoading(true);

      await axios.post(`${API_URL}/api/orders/create`, {
        userId: userInfo.id,
        postId: post._id,
        phoneNumber,
        eventDate,
        eventLocation,
        requirements,
        totalAmount: post.discountedPrice || post.price,
      });

     
      setHasUserOrder(true);
      setUserOrderStatus("pending");

      alert("Booking request sent!");
      setShowModal(false);
      setFormData({
        phoneNumber: "",
        eventDate: "",
        eventLocation: "",
        requirements: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return <div className="pt-20 text-center text-purple-600">Loading...</div>;
  if (error)
    return <div className="pt-20 text-center text-red-500">{error}</div>;
  if (!post) return null;

 return (
  <div className="min-h-screen pt-24 px-6 md:px-20 bg-gray-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
      <div className="grid md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="flex justify-center items-center">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="rounded-2xl max-h-[450px] w-full object-cover shadow-md"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {post.title}
            </h1>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {post.description}
            </p>

            {/* PRICE */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-purple-700">
                ₹{post.discountedPrice}
              </span>
              <span className="line-through text-gray-400 text-lg">
                ₹{post.price}
              </span>
              <span className="text-green-600 font-semibold">
                {post.discountPercent}% OFF
              </span>
            </div>

            {/* EXTRA INFO */}
            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Color:</span>{" "}
                {post.color}
              </p>
              <p>
                <span className="font-medium text-gray-800">Available Size:</span>{" "}
                {post.size?.join(", ")}
              </p>
            </div>

            {/* STATUS */}
            <div className="mt-5">
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold
                  ${
                    bookedByOther
                      ? "bg-red-100 text-red-600"
                      : hasUserOrder
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {bookedByOther
                  ? "Out of Stock"
                  : hasUserOrder
                  ? userOrderStatus === "confirmed"
                    ? "Booked"
                    : "Pending Approval"
                  : "In Stock"}
              </span>
            </div>
          </div>

          {/* VENDOR */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Vendor Details
            </h3>
            {post.vendorId ? (
              <>
                <Link
                  to={`/vendor/${post.vendorId._id}`}
                  className="text-purple-700 font-semibold hover:underline"
                >
                  {post.vendorId.name}
                </Link>
                <p className="text-sm text-gray-600">
                  {post.vendorId.email || "N/A"}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Vendor information not available</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleBookNow}
            disabled={bookedByOther || hasUserOrder}
            className="mt-8 w-full border-2 border-purple-700 text-purple-700 py-3 rounded-xl font-semibold
                       hover:bg-purple-700 hover:text-white transition disabled:opacity-50 disabled:hover:bg-transparent"
          >
            {bookedByOther
              ? "Unavailable"
              : hasUserOrder
              ? "Pending"
              : "Book Now"}
          </button>
        </div>
      </div>
    </div>

    {/* MODAL */}
    {showModal && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Booking Information
          </h2>

          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) =>
                setFormData({ ...formData, eventDate: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <textarea
              placeholder="Event Location"
              value={formData.eventLocation}
              onChange={(e) =>
                setFormData({ ...formData, eventLocation: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              rows="3"
              required
            />

            <textarea
              placeholder="Additional Requirements"
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              rows="2"
            />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={bookingLoading}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
              >
                {bookingLoading ? "Submitting..." : "Submit Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

};

export default ProductDetail;
