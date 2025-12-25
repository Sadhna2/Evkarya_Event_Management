import React, { useEffect, useState } from "react";
import { fetchCategories, fetchPostsByCategory } from "../../../api/postApi";

const CategoryFilter = () => {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [posts, setPosts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data);
      } catch (err) {
        setError("Error loading categories.");
        console.error("Error loading categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = async (e) => {
    const selectedCategory = e.target.value;
    setSelected(selectedCategory);
    setLoadingPosts(true); 

    try {
      const res = await fetchPostsByCategory(selectedCategory);
      setPosts(res.data);
    } catch (err) {
      setError("Error fetching posts.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoadingPosts(false); 
    }
  };

  return (
    <div className="p-4">
      {loadingCategories ? (
        <div>Loading categories...</div>
      ) : (
        <select
          className="p-2 border rounded"
          value={selected}
          onChange={handleChange}
          aria-label="Select category to filter posts"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      {loadingPosts && <div>Loading posts...</div>}

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition-all duration-200 ease-in-out"
          >
            <img
              src={post.imageUrl}
              alt={`Image for ${post.title}`}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-2">{post.title}</h3>
            <p className="text-sm">{post.description}</p>
            <p className="mt-1 font-medium text-green-600">₹{post.price}</p>
            <p className="text-xs text-gray-500">Category: {post.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
