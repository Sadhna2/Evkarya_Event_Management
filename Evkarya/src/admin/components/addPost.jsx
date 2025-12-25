import React, { useState } from "react";
import axios from "axios";

const AddPost = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const vendorId = localStorage.getItem("vendorId");

  const handleDiscountPercentChange = (e) => {
    const discount = e.target.value;
    setDiscountPercent(discount);

    if (price) {
      const discounted = price - (price * discount) / 100;
      setDiscountedPrice(discounted.toFixed(2)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !category || !vendorId) {
      setError("Please fill all the required fields.");
      return;
    }

    const newPostData = {
      vendorId,
      title,
      imageUrl,
      description,
      price,
      discountedPrice,
      discountPercent,
      color,
      size,
      category,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/`,
        newPostData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Post added successfully!");
        setError("");
       
        setTitle("");
        setImageUrl("");
        setDescription("");
        setPrice("");
        setDiscountedPrice("");
        setDiscountPercent("");
        setColor("");
        setSize([]);
        setCategory(""); 
      }
    } catch (error) {
      console.error("Error adding post:", error.response ? error.response.data : error.message);
      setError("Error adding post. Please try again.");
      setSuccessMessage(""); 
    }
  };

  
  const categories = [
    "Bridal Wear", "Jewelry", "Makeup & Styling", "Decor & Venues", "Theme Parties",
    "Cake & Decorations", "Photography", "Entertainment", "Wedding Bands", "Choreographers", 
    "Mehendi Artists", "Wedding Cakes", "Menu - Vegetarian", "Menu - Non-Vegetarian", 
    "Menu - Buffet", "Menu - Custom", "Live Counters", "Desserts & Beverages", 
    "Themes & Decor", "Party Entertainment", "Party Planners", "Return Gifts", 
    "Magicians & Clowns", "Wedding DJs", "Party DJs", "Corporate Events", "Live Bands", 
    "Sound & Lighting", "Dance Floors"
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Post</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Title: <span style={styles.required}>*</span></label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Image URL:</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Description: <span style={styles.required}>*</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <label style={styles.label}>Price: <span style={styles.required}>*</span></label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Discounted Price:</label>
        <input
          type="number"
          value={discountedPrice}
          readOnly 
          style={styles.input}
        />

        <label style={styles.label}>Discount Percentage:</label>
        <input
          type="number"
          value={discountPercent}
          onChange={handleDiscountPercentChange} 
          style={styles.input}
        />

        <label style={styles.label}>Color:</label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Size:</label>
        <input
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value.split(",").map(s => s.trim()))} 
          style={styles.input}
        />

        <label style={styles.label}>Category: <span style={styles.required}>*</span></label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button}>Add Post</button>
      </form>

      {error && <div style={styles.error}>{error}</div>}
      {successMessage && (
        <div style={styles.success}>
          <strong>{successMessage}</strong>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "bold",
  },
  required: {
    color: "red",
  },
  input: {
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default AddPost;
