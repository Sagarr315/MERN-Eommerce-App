import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { FaSync, FaBox, FaShoppingBag } from 'react-icons/fa';
import styles from '../../css/AdminOrdersList.module.css';

interface OrderProduct {
  productId: {
    _id: string;
    title: string;
    images: string[];
  } | null;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  customerInfo?: {
    name: string;
    email: string;
    shippingAddress: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const AdminOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders');
      setOrders(res.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrder(orderId);
    try {
      await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending': return `${styles.statusBadge} ${styles.badgePending}`;
      case 'processing': return `${styles.statusBadge} ${styles.badgeProcessing}`;
      case 'shipped': return `${styles.statusBadge} ${styles.badgeShipped}`;
      case 'delivered': return `${styles.statusBadge} ${styles.badgeDelivered}`;
      case 'cancelled': return `${styles.statusBadge} ${styles.badgeCancelled}`;
      default: return styles.statusBadge;
    }
  };

  if (loading) return (
    <div className={styles.spinnerContainer}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
   <div className={`${styles.categoriesContainer} m-5`}>
      <div className={styles.headerSection}>
        <h2 className={styles.headerTitle}>
          <FaShoppingBag className="text-primary me-2" />
          Orders Management
        </h2>
        <div className={styles.actionsSection}>
          <button onClick={fetchOrders} className={styles.refreshBtn}>
            <FaSync className="me-2" />
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className={styles.categoryCard}>
        <div className={styles.cardHeader}>
          <h5 className={styles.cardTitle}>All Orders ({orders.length})</h5>
        </div>
        <div className="card-body  m-3">
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Details</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <small className="text-muted">#{order._id.slice(-6)}</small>
                    </td>
                    <td>
                      <div>
                        <strong>{order.customerInfo?.shippingAddress?.fullName || 'N/A'}</strong>
                        <br />
                        <small>Phone: {order.customerInfo?.shippingAddress?.phone || 'N/A'}</small>
                        <br />
                        <small>Email: {order.customerInfo?.email || 'N/A'}</small>
                        <br />
                        <small>
                          {order.customerInfo?.shippingAddress ? 
                            `${order.customerInfo.shippingAddress.street}, ${order.customerInfo.shippingAddress.city}` 
                            : 'Address N/A'
                          }
                        </small>
                      </div>
                    </td>
                    <td>
                      <div>
                        {order.products.slice(0, 2).map((product, index) => (
                          <div key={index} className="d-flex align-items-center mb-1">
                            {product.productId?.images && product.productId.images.length > 0 ? (
                              <img 
                                src={product.productId.images[0]} 
                                alt={product.productId?.title || 'Product image'}
                                className="rounded me-2"
                                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="bg-secondary rounded me-2 d-flex align-items-center justify-content-center"
                                style={{ width: '30px', height: '30px' }}>
                                <FaBox className="text-white small" />
                              </div>
                            )}
                            <small>
                              {product.productId?.title || 'Unknown Product'} (x{product.quantity})
                            </small>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <small className="text-muted">+{order.products.length - 2} more</small>
                        )}
                      </div>
                    </td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['status'])}
                        disabled={updatingOrder === order._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingOrder === order._id && (
                        <small className="text-muted ms-1">Updating...</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className={styles.emptyState}>
              <h5>No orders found</h5>
              <p className="text-muted">Orders will appear here when customers place them.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersList;