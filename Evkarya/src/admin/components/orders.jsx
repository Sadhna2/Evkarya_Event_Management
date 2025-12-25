import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersTable = () => {

   const API_URL = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    tableContainer: {
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '95%',
      maxWidth: '1200px',
    },
    heading: {
      textAlign: 'center',
      fontSize: '24px',
      color: '#4A90E2',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px',
      backgroundColor: '#4A90E2',
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    td: {
      padding: '12px',
      border: '1px solid #ddd',
      textAlign: 'center',
      backgroundColor: '#fff',
      color: '#333',
    },
    button: {
      backgroundColor: '#4A90E2',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      margin: '5px 2px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
    },
    disabledText: {
      color: '#aaa',
      fontStyle: 'italic',
    },
    saveButton: {
      backgroundColor: 'green',
      color: '#fff',
      fontSize: '12px',
      padding: '6px 12px',
      cursor: 'pointer',
      borderRadius: '4px',
      marginRight: '5px',
    },
    cancelButton: {
      backgroundColor: 'red',
      color: '#fff',
      fontSize: '12px',
      padding: '6px 12px',
      cursor: 'pointer',
      borderRadius: '4px',
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const vendorId = localStorage.getItem("vendorId");

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        const fetchedOrders = res.data.data;

        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const token = localStorage.getItem("userToken");
    try {
      const res = await axios.delete(
        `${API_URL}/api/orders/cancel/${orderId}`,
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        alert('Order cancelled successfully!');
      } else {
        alert('Failed to cancel order.');
      }
    } catch (err) {
      console.error('Error cancelling order:', err.response ? err.response.data : err.message);
      alert('Error occurred while cancelling order.');
    }
  };

  const handleConfirm = async (orderId) => {
    const token = localStorage.getItem("userToken");
    try {
      const res = await axios.put(
        `${API_URL}/api/orders/confirm/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId
              ? { ...order, status: 'confirmed' }
              : order.postId === prev.find(o => o._id === orderId).postId && order.status === 'pending'
                ? { ...order, status: 'discarded' }
                : order
          )
        );
        alert("Order confirmed. Others discarded.");
      } else {
        alert("Failed to confirm order.");
      }
    } catch (err) {
      console.error("Error confirming order:", err.response ? err.response.data : err.message);
      alert("Error occurred while confirming order.");
    }
  };
  
  const handleDiscard = async (orderId) => {
    const token = localStorage.getItem("userToken");
    try {
      const res = await axios.delete(
        `${API_URL}/api/orders/cancel/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { status: 'discarded' },
        }
      );
      if (res.data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: 'discarded' } : order
          )
        );
        alert("Order discarded.");
      } else {
        alert("Failed to discard order.");
      }
    } catch (err) {
      console.error("Error discarding order:", err.response ? err.response.data : err.message);
      alert("Error occurred while discarding order.");
    }
  };
  

  const handleMarkCompleted = async (orderId) => {
    const token = localStorage.getItem("userToken");
    try {
      const res = await axios.put(
        `${API_URL}/api/orders/update/${orderId}`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: 'completed' } : order
          )
        );
        alert('Order marked as completed!');
      } else {
        alert('Failed to mark order as completed.');
      }
    } catch (err) {
      console.error('Error marking order as completed:', err.response ? err.response.data : err.message);
      alert('Error occurred while marking order as completed.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div style={styles.tableContainer}>
      <h2 style={styles.heading}>Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Event Name</th>
            <th style={styles.th}>Customer Name</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Post Title</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Total ₹</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const remaining = order.totalAmount - order.paidAmount;
            const eventName = order.category || 'Load.'; 

            return (
              <tr key={order._id}>
                <td style={styles.td}>{eventName}</td>
                <td style={styles.td}>{order.userId.name}</td>
                <td style={styles.td}>{order.eventLocation}</td>
                <td style={styles.td}>{order.postId.title}</td>
                <td style={styles.td}>{new Date(order.eventDate).toLocaleDateString()}</td>
                <td style={styles.td}>{order.totalAmount}</td>
                <td style={styles.td}>{order.status}</td>
                <td style={styles.td}>
  {order.status === 'upcoming' ? (
    <>
      <button
        style={styles.button}
        onClick={() => handleMarkCompleted(order._id)}
      >
        Mark Completed
      </button>
      <button
        style={styles.button}
        onClick={() => handleCancel(order._id)}
      >
        Cancel
      </button>
    </>
  ) : order.status === 'pending' ? (
    <>
      <button
        style={{ ...styles.button, backgroundColor: 'green' }}
        onClick={() => handleConfirm(order._id)}
      >
        Confirm
      </button>
      <button
        style={{ ...styles.button, backgroundColor: 'red' }}
        onClick={() => handleDiscard(order._id)}
      >
        Discard
      </button>
    </>
  ) : (
    <span style={styles.disabledText}>N/A</span>
  )}
</td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
