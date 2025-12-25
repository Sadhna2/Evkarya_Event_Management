import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
   const API_URL = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPostData, setEditPostData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const vendorId = localStorage.getItem("vendorId");

    if (token && vendorId) {
      axios
        .get(`${API_URL}/api/posts/vendor/${vendorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setPosts(response.data.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching posts.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const deletePost = async (postId) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        await axios.delete(`${API_URL}/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.filter(post => post._id !== postId));
      } catch {
        setError("Error deleting post.");
      }
    }
  };

  const updatePost = async (postId, updatedData) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const response = await axios.put(
          `${API_URL}/api/posts/${postId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPosts(posts.map(post =>
          post._id === postId ? response.data.post : post
        ));

        setEditPostData(null);
      } catch {
        setError("Error updating post.");
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div style={styles.loader}>Loading...</div>
      ) : (
        <div>
          {error && <div style={styles.errorMessage}>{error}</div>}
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            <div style={styles.gridContainer}>
              {posts.map((post) => (
                <div key={post._id} style={styles.gridItem}>
                  {editPostData && editPostData._id === post._id ? (
                    <div style={styles.editForm}>
                      <h3>Edit Post</h3>
                      <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Title</label>
                        <input
                          type="text"
                          value={editPostData.title}
                          onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
                          style={styles.inputField}
                          placeholder="Title"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Description</label>
                        <textarea
                          value={editPostData.description}
                          onChange={(e) => setEditPostData({ ...editPostData, description: e.target.value })}
                          style={styles.inputTextArea}
                          placeholder="Description"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Price</label>
                        <input
                          type="number"
                          value={editPostData.price}
                          onChange={(e) => setEditPostData({ ...editPostData, price: e.target.value })}
                          style={styles.inputField}
                          placeholder="Price"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Discounted Price</label>
                        <input
                          type="number"
                          value={editPostData.discountedPrice}
                          onChange={(e) => setEditPostData({ ...editPostData, discountedPrice: e.target.value })}
                          style={styles.inputField}
                          placeholder="Discounted Price"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Discount Percent</label>
                        <input
                          type="number"
                          value={editPostData.discountPercent}
                          onChange={(e) => setEditPostData({ ...editPostData, discountPercent: e.target.value })}
                          style={styles.inputField}
                          placeholder="Discount Percent"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Color</label>
                        <input
                          type="text"
                          value={editPostData.color}
                          onChange={(e) => setEditPostData({ ...editPostData, color: e.target.value })}
                          style={styles.inputField}
                          placeholder="Color"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Sizes</label>
                        <input
                          type="text"
                          value={editPostData.size}
                          onChange={(e) => setEditPostData({ ...editPostData, size: e.target.value.split(',') })}
                          style={styles.inputField}
                          placeholder="Sizes (comma separated)"
                        />
                      </div>
                      <div style={styles.buttonContainer}>
                        <button onClick={() => updatePost(post._id, editPostData)} style={styles.editFormButton}>
                          Save
                        </button>
                        <button onClick={() => setEditPostData(null)} style={styles.editFormCancelButton}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.postCard}>
                      <h3 style={styles.postTitle}>{post.title}</h3>
                      <img style={styles.postImage} src={post.imageUrl} alt={post.title} />
                      <p>{post.description}</p>
                      <div>
                        {post.discountedPrice ? (
                          <>
                            <p style={styles.originalPrice}>₹{post.price}</p>
                            <p style={styles.discountedPrice}>Discounted Price: ₹{post.discountedPrice}</p>
                          </>
                        ) : (
                          <p style={styles.price}>₹{post.price}</p>
                        )}
                      </div>
                      {post.discountPercent && (
                        <p style={styles.discountPercent}>Discount: {post.discountPercent}%</p>
                      )}
                      {post.color && <p>Color: {post.color}</p>}
                      {post.size && post.size.length > 0 && (
                        <p>Available Sizes: {post.size.join(", ")}</p>
                      )}
                      
                      {post.availability === false ? (
                        <p style={styles.unavailableText}>Not available</p>
                      ) : (
                        <p style={styles.availableText}>Available</p>
                      )}

                      <div style={styles.buttonContainer}>
                        <button onClick={() => setEditPostData(post)} style={styles.editButton}>
                          Edit
                        </button>
                        <button onClick={() => deletePost(post._id)} style={styles.deleteButton}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    textAlign: 'center',
    border: '1px solid #ddd',
    height: '100%',
  },
  postCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  price: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#28a745',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: '#dc3545',
    fontSize: '1rem',
  },
  discountedPrice: {
    fontWeight: 'bold',
    color: '#f39c12',
    fontSize: '1.2rem',
  },
  discountPercent: {
    color: '#f39c12',
    fontSize: '1rem',
  },
  availableText: {
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  unavailableText: {
    color: '#dc3545',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
    fontSize: '1rem',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
    fontSize: '1rem',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '8px',
    color: '#333',
  },
  inputField: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    marginBottom: '12px',
  },
  inputTextArea: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    minHeight: '100px',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  editFormButton: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
  },
  editFormCancelButton: {
    padding: '12px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
  },
};

export default Posts;
