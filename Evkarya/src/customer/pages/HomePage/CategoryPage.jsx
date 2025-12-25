import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // 🔁 Link imported
import axios from 'axios';

export default function CategoryPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { categoryName } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryPosts() {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/posts?category=${encodeURIComponent(categoryName)}&limit=10`);

        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category posts:', error);
        setLoading(false);
      }
    }

    fetchCategoryPosts();
  }, [categoryName]);

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10">
        Category: {decodeURIComponent(categoryName)}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/product/${post._id}`} // 👈 Click logic to redirect
              className="border p-4 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl bg-white"
            >
              <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{post.title}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.description}</p>
              <div className="mt-3 text-indigo-600 font-bold text-lg">₹{post.discountedPrice}</div>
              <div className="text-sm text-gray-500 line-through">₹{post.price}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
