import { useState, useEffect } from "react";
import axios from "axios";

const VendorProfile = () => {
 const API_URL = process.env.REACT_APP_API_URL;
  const vendorId = localStorage.getItem("vendorId");
  const [vendor, setVendor] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/vendors/${vendorId}/bio`).then((res) => {
      const vendorData = res.data.vendor;
      setVendor(vendorData);
      setFormData({
        ...vendorData,
        notAvailableDates: vendorData.notAvailableDates || [],
      });
    });
  }, [vendorId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddUnavailableDate = () => {
    setFormData({
      ...formData,
      notAvailableDates: [...(formData.notAvailableDates || []), ""],
    });
  };

  const handleUnavailableDateChange = (index, newDate) => {
    const updatedDates = [...formData.notAvailableDates];
    updatedDates[index] = newDate;
    setFormData({
      ...formData,
      notAvailableDates: updatedDates,
    });
  };

  const handleRemoveUnavailableDate = (index) => {
    const updatedDates = formData.notAvailableDates.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      notAvailableDates: updatedDates,
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (!formData.categories.includes(selectedCategory)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, selectedCategory],
      });
    }
  };

  const handleSave = () => {
    console.log("Saving vendor with data:", formData);
    axios
      .put(`${API_URL}/api/vendors/${vendorId}`, formData)
      .then((res) => {
        setVendor(res.data.vendor);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Update failed:", err.response?.data || err.message);
      });
  };

  if (!vendor) return <p>Loading...</p>;

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "30px auto",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      fontFamily: "Segoe UI, sans-serif",
      backgroundColor: "#fff",
    },
    header: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      marginBottom: "30px",
    },
    info: { flex: 1 },
    name: { fontSize: "24px", margin: 0 },
    email: { color: "#666" },
    label: { fontWeight: 600, display: "block", marginTop: "20px", marginBottom: "5px" },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      height: "100px",
      resize: "vertical",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "14px",
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "#0f62fe",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    list: {
      listStyle: "disc",
      paddingLeft: "20px",
    },
    removeBtn: {
      marginLeft: "10px",
      backgroundColor: "crimson",
      color: "white",
      padding: "5px 10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  const categoryOptions = [
    "Bridal Wear", "Jewelry", "Makeup & Styling", "Decor & Venues", "Theme Parties",
    "Cake & Decorations", "Photography", "Entertainment", "Wedding Bands", "Choreographers",
    "Mehendi Artists", "Wedding Cakes", "Menu - Vegetarian", "Menu - Non-Vegetarian",
    "Menu - Buffet", "Menu - Custom", "Live Counters", "Desserts & Beverages",
    "Themes & Decor", "Party Entertainment", "Party Planners", "Return Gifts",
    "Magicians & Clowns", "Wedding DJs", "Party DJs", "Corporate Events",
    "Live Bands", "Sound & Lighting", "Dance Floors"
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.info}>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </>
          ) : (
            <>
              <h2 style={styles.name}>{vendor.name}</h2>
              <p style={styles.email}>{vendor.email}</p>
            </>
          )}
        </div>
      </div>

      <div>
        <label style={styles.label}>Bio:</label>
        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            style={styles.textarea}
          />
        ) : (
          <p>{vendor.bio}</p>
        )}

        <label style={styles.label}>Available:</label>
        {isEditing ? (
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
        ) : (
          <p>{vendor.availability ? "Yes" : "No"}</p>
        )}

        <label style={styles.label}>Unavailable Dates:</label>
        {isEditing ? (
          <div>
            {(formData.notAvailableDates || []).map((date, index) => (
              <div key={index}>
                <input
                  type="date"
                  value={date?.substring(0, 10)}
                  onChange={(e) => handleUnavailableDateChange(index, e.target.value)}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveUnavailableDate(index)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddUnavailableDate} style={{ ...styles.button, marginTop: "10px" }}>
              Add Unavailable Date
            </button>
          </div>
        ) : (
          <ul style={styles.list}>
            {(vendor.notAvailableDates || []).map((date, idx) => (
              <li key={idx}>{date?.substring(0, 10)}</li>
            ))}
          </ul>
        )}

        <label style={styles.label}>Categories:</label>
        {isEditing ? (
          <div>
            <select onChange={handleCategoryChange} style={styles.select}>
              <option value="">Select a category</option>
              {categoryOptions.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div style={styles.list}>
              {formData.categories.map((cat, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                  <li>{cat}</li>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedCategories = formData.categories.filter((category, index) => index !== idx);
                      setFormData({
                        ...formData,
                        categories: updatedCategories,
                      });
                    }}
                    style={{ ...styles.removeBtn, marginLeft: "10px" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ul style={styles.list}>
            {vendor.categories && vendor.categories.length > 0 ? (
              vendor.categories.map((cat, idx) => (
                <li key={idx}>{cat}</li>
              ))
            ) : (
              <p>No categories selected.</p>
            )}
          </ul>
        )}

        <div>
          {isEditing ? (
            <button onClick={handleSave} style={styles.button}>
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} style={styles.button}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
