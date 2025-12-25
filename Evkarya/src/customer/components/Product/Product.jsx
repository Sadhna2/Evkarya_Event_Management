import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
const API_URL = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  
  useEffect(() => {
    const fetchPosts = async () => {
      if (selectedCategory === "") return;

      setLoadingPosts(true);
      setErrorPosts(null); 

      try {
        const res = await axios.get(`${API_URL}/api/posts?category=${selectedCategory}`);
        setPosts(res.data);
      } catch (err) {
        setErrorPosts("Failed to fetch posts. Please try again later.");
        console.error("Failed to fetch posts", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  return (
    <div className="p-4 pt-24 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">Explore Event Services</h2>

      {loadingCategories ? (
        <div className="text-center text-purple-700">Loading categories...</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full border transition-all duration-200 text-sm font-medium shadow-sm ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-purple-700 border-purple-300 hover:bg-purple-100"
              }`}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <h3 className="text-xl text-gray-700 mb-4 text-center">
        {selectedCategory ? `Showing: ${selectedCategory}` : "Select a category to view services"}
      </h3>

      {loadingPosts && <div className="text-center text-purple-700">Loading posts...</div>}

      {errorPosts && <div className="text-center text-red-500">{errorPosts}</div>}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all"
            >
              <img
                src={post.imageUrl || "/path/to/default-image.jpg"} 
                alt={`Image for ${post.title}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-purple-700 mb-1">{post.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>
                <p className="mt-2 text-md font-bold text-purple-600">
                  ₹{post.discountedPrice || post.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 italic">
            No posts found for this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
