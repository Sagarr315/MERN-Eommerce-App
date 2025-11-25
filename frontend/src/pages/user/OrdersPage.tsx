import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

interface OrderProduct {
  productId: {
    _id: string;
    title: string;
    price: number;
    images: string;
  } | null;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  customerInfo?: {
    shippingAddress?: {
      fullName: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone: string;
    };
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
      setOrders(response.data);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-warning text-dark",
      processing: "bg-info text-white",
      shipped: "bg-primary text-white",
      delivered: "bg-success text-white",
      cancelled: "bg-danger text-white",
    };

    return (
      <span
        className={`badge ${
          statusClasses[status as keyof typeof statusClasses] || "bg-secondary"
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const getStatusMessage = (status: string) => {
    const messages = {
      pending:
        "We have received your order. Our team will contact you soon for payment and delivery details.",
      processing:
        "Your order is being processed. We will contact you within 24 hours.",
      shipped:
        "Your order has been shipped. You will receive it in 5-7 business days.",
      delivered:
        "Your order has been delivered. Thank you for shopping with us!",
      cancelled: "This order has been cancelled.",
    };
    return (
      messages[status as keyof typeof messages] || "Order is being processed."
    );
  };

  // Safe phone access function
  const getUserPhone = (): string => {
    if (!user) return "Not provided";
    // Type-safe phone access
    const userWithPhone = user as any;
    return userWithPhone.phone || "Not provided";
  };

  // Safe name access function
  const getUserName = (): string => {
    if (!user) return "Customer";
    return user.name || "Customer";
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
        <Link to="/" className="btn btn-outline-primary">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h5 className="card-title">No orders yet</h5>
            <p className="card-text">You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-12 mb-4">
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
                  {/* Status Message */}
                  <div className="alert alert-info mb-3">
                    <strong>Order Status: </strong>
                    {getStatusMessage(order.status)}
                  </div>

                  {/* Contact Information */}
                  <div className="mb-3">
                    <h6>Contact & Shipping Details:</h6>
                    <p className="mb-1">
                      <strong>Name:</strong>{" "}
                      {order.customerInfo?.shippingAddress?.fullName ||
                        getUserName()}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong>{" "}
                      {order.customerInfo?.shippingAddress?.phone ||
                        getUserPhone()}
                    </p>
                    <p className="mb-1">
                      <strong>Address:</strong>{" "}
                      {order.customerInfo?.shippingAddress?.street ||
                        "Not provided"}
                      ,
                      {order.customerInfo?.shippingAddress?.city ||
                        "Not provided"}
                      ,
                      {order.customerInfo?.shippingAddress?.state ||
                        "Not provided"}{" "}
                      -
                      {order.customerInfo?.shippingAddress?.zipCode ||
                        "Not provided"}
                    </p>
                  </div>

                  {/* Order Items */}
                  <h6>Order Items ({order.products?.length || 0}):</h6>
                  {order.products && order.products.length > 0 ? (
                    order.products.map((item: OrderProduct, index: number) => {
                      console.log("Full product data:", item.productId); // Check what's actually there
                      return (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2 p-2 border rounded"
                        >
                          <div
                            className="rounded me-3 d-flex align-items-center justify-content-center bg-light"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          >
                            {item.productId?.images?.[0] ? ( // ✅ Changed to images?.[0]
                              <img
                                src={item.productId.images[0]} // ✅ Changed to images[0]
                                alt={item.productId?.title || "Product image"}
                                className="rounded"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-muted small">No Image</span>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">
                              {item.productId?.title || "Product not available"}
                            </h6>
                            <small className="text-muted">
                              Quantity: {item.quantity}
                            </small>
                          </div>
                          <div className="text-end">
                            <div>
                              ₹{item.productId?.price?.toLocaleString() || "0"}{" "}
                              each
                            </div>
                            <strong>
                              ₹
                              {(
                                (item.productId?.price || 0) * item.quantity
                              ).toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted">No products in this order</p>
                  )}

                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>
                      Total Amount: ₹
                      {order.totalAmount?.toLocaleString() || "0"}
                    </strong>
                    <small className="text-muted">
                      Our team will contact you at:{" "}
                      <strong>
                        {order.customerInfo?.shippingAddress?.phone ||
                          getUserPhone()}
                      </strong>
                    </small>
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
