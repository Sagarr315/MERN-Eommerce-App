import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

interface OrderProduct {
  productId: {
    _id: string;
    title: string;
    price: number;
    image: string;
  } | null;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.get(`/orders/${user?.id}`);
      
      const safeOrders = response.data.map((order: any) => ({
        ...order,
        shippingAddress: order.shippingAddress || {
          fullName: 'Not provided',
          street: 'Not provided', 
          city: 'Not provided',
          state: 'Not provided',
          zipCode: 'Not provided',
          country: 'Not provided',
          phone: 'Not provided'
        },
        products: (order.products || []).map((product: any) => ({
          ...product,
          productId: product.productId || {
            _id: 'unknown',
            title: 'Product not available',
            price: 0,
            image: '/images/placeholder.jpg'
          }
        }))
      }));
      
      setOrders(safeOrders);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-warning text-dark',
      confirmed: 'bg-info text-white',
      shipped: 'bg-primary text-white',
      delivered: 'bg-success text-white',
      cancelled: 'bg-danger text-white'
    };

    return (
      <span className={`badge ${statusClasses[status as keyof typeof statusClasses] || 'bg-secondary'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <Link to="/products" className="btn btn-outline-primary">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h5 className="card-title">No orders yet</h5>
            <p className="card-text">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-md-8 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Order # {order._id.slice(-8).toUpperCase()}</strong>
                    <br />
                    <small className="text-muted">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6>Shipping Address:</h6>
                    <p className="mb-1">
                      <strong>{order.shippingAddress?.fullName || 'Not provided'}</strong>
                    </p>
                    <p className="mb-1">{order.shippingAddress?.street || 'Not provided'}</p>
                    <p className="mb-1">
                      {order.shippingAddress?.city || 'Not provided'}, {order.shippingAddress?.state || 'Not provided'} {order.shippingAddress?.zipCode || 'Not provided'}
                    </p>
                    <p className="mb-1">{order.shippingAddress?.country || 'Not provided'}</p>
                    <p className="mb-0">{order.shippingAddress?.phone || 'Not provided'}</p>
                  </div>

                  <h6>Order Items:</h6>
                  {order.products && order.products.length > 0 ? (
                    order.products.map((item: OrderProduct, index: number) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <img
                          src={item.productId?.image || '/images/placeholder.jpg'}
                          alt={item.productId?.title || 'Product image'}
                          className="rounded me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                          }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{item.productId?.title || 'Product not available'}</h6>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                        <div className="text-end">
                          <strong>₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No products in this order</p>
                  )}

                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total Amount: ₹{order.totalAmount?.toLocaleString() || '0'}</strong>
                    <button className="btn btn-outline-secondary btn-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;