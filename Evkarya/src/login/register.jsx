import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '80px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '24px',
    color: '#333',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    color: '#444',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginTop: '5px',
  },
  button: {
    backgroundColor: '#6c5ce7',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
    cursor: 'not-allowed',
  },
};

const Register = () => {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    upiId: '',
    acceptedTerms: false,
  });

  const API_URL = process.env.REACT_APP_API_URL;
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role === 'vendor' && !formData.upiId.trim()) {
      alert('Please enter your UPI ID.');
      return;
    }


    try {
      const res = await axios.post(
  `${API_URL}/api/auth/register`,
  formData
);
      alert(res.data.message);

      if (formData.role === 'vendor') {
        navigate(`/vendor/${res.data.user._id}`);
      } else {
        navigate('/login');
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  const isVendor = formData.role === 'vendor';
  const isVendorAndTermsUnaccepted = isVendor && !formData.acceptedTerms;

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Register</h2>

        <label style={styles.label}>
          Name:
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </label>

        <label style={styles.label}>
          Email:
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>

        <label style={styles.label}>
          Phone:
          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />
        </label>

        <label style={styles.label}>
          Password:
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </label>

        <label style={styles.label}>
          Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="user">User</option>
            <option value="vendor">Vendor</option>
          </select>
        </label>

        {isVendor && (
          <>
            <label style={styles.label}>
              UPI ID:
              <input
                style={styles.input}
                type="text"
                name="upiId"
                placeholder="example@upi"
                value={formData.upiId}
                onChange={handleChange}
                required={isVendor}
              />
            </label>

            <label style={{ ...styles.label, flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                required
              />
              I accept the terms and conditions
            </label>
          </>
        )}

        <button
          style={{ ...styles.button, ...(isVendorAndTermsUnaccepted ? styles.buttonDisabled : {}) }}
          type="submit"
          disabled={isVendorAndTermsUnaccepted}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
