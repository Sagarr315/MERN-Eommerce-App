import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaHome,
} from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  isDefault: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  addresses: Address[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "" });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "_id">>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    type: "shipping",
    isDefault: false,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data);
      setEditData({ name: res.data.name, phone: res.data.phone || "" });
    } catch (error) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axiosInstance.put("/users/profile", editData);
      setUser(res.data.user);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile");
    }
  };

  const handleAddAddress = async () => {
    try {
      await axiosInstance.post("/users/addresses", newAddress);
      fetchUserProfile();
      setShowAddressForm(false);
      setNewAddress({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        type: "shipping",
        isDefault: false,
      });
    } catch (error) {
      console.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await axiosInstance.delete(`/users/addresses/${addressId}`);
      fetchUserProfile();
    } catch (error) {
      console.error("Failed to delete address");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4 pb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <FaUser className="me-2" />
              My Profile
            </h2>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/user")}
            >
              <FaHome className="me-1" /> Dashboard
            </button>
          </div>

          {/* Profile Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Personal Information</h5>
              {!editing ? (
                <button
                  className="btn btn-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                  onClick={() => setEditing(true)}
                >
                  <FaEdit className="me-1" /> Edit
                </button>
              ) : (
                <div>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={handleSaveProfile}
                  >
                    <FaSave className="me-1" /> Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditing(false)}
                  >
                    <FaTimes className="me-1" /> Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="card-body">
              {editing ? (
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-12 col-sm-6 mb-2">
                    <strong>Name:</strong> {user?.name}
                  </div>
                  <div className="col-12 col-sm-6 mb-2">
                    <strong>Email:</strong> {user?.email}
                  </div>
                  <div className="col-12 col-sm-6 mb-2">
                    <strong>Phone:</strong> {user?.phone || "Not provided"}
                  </div>
                  <div className="col-12 col-sm-6 mb-2">
                    <strong>Role:</strong>{" "}
                    <span className="badge bg-primary">Customer</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Addresses Section */}
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Addresses</h5>
              <button
                className="btn btn-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
                onClick={() => setShowAddressForm(true)}
              >
                <FaPlus className="me-1" /> Add Address
              </button>
            </div>
            <div className="card-body">
              {/* Add Address Form */}
              {showAddressForm && (
                <div className="border p-3 rounded mb-4 bg-light">
                  <h6>Add New Address</h6>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Phone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            street: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="ZIP Code"
                        value={newAddress.zipCode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            zipCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              isDefault: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label">
                          Set as default address
                        </label>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={handleAddAddress}
                        >
                          Save Address
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setShowAddressForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Address List */}
              {user?.addresses?.length === 0 ? (
                <p className="text-muted text-center py-3">
                  No addresses saved yet.
                </p>
              ) : (
                <div className="row">
                  {user?.addresses?.map((address) => (
                    <div key={address._id} className="col-12 mb-3">
                      <div className="border p-3 rounded position-relative">
                        {address.isDefault && (
                          <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                            Default
                          </span>
                        )}
                        <div className="row">
                          <div className="col-12 col-md-8">
                            <strong>{address.fullName}</strong>
                            <p className="mb-1">{address.street}</p>
                            <p className="mb-1">
                              {address.city}, {address.state} -{" "}
                              {address.zipCode}
                            </p>
                            <p className="mb-1">{address.country}</p>
                            <p className="mb-0">Phone: {address.phone}</p>
                          </div>
                          <div className="col-12 col-md-4 text-end">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                address._id && handleDeleteAddress(address._id)
                              }
                            >
                              <FaTrash /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
