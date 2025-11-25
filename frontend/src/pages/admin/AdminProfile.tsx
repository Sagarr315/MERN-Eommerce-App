import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaHome } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await axiosInstance.get('/users/profile');
      setAdmin(res.data);
      setEditData({ name: res.data.name, phone: res.data.phone || '' });
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axiosInstance.put('/users/profile', editData);
      setAdmin(res.data.user);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center py-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="container mt-4 pb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0"><FaUser className="me-2" />Admin Profile</h2>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/admin')}
            >
              <FaHome className="me-1" /> Dashboard
            </button>
          </div>

          {/* Profile Card */}
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Administrator Information</h5>
              {!editing ? (
                <button 
                  className="btn btn-sm"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
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
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-12 col-sm-6 mb-3">
                    <strong>Name:</strong><br />{admin?.name}
                  </div>
                  <div className="col-12 col-sm-6 mb-3">
                    <strong>Email:</strong><br />{admin?.email}
                  </div>
                  <div className="col-12 col-sm-6 mb-3">
                    <strong>Phone:</strong><br />{admin?.phone || 'Not provided'}
                  </div>
                  <div className="col-12 col-sm-6 mb-3">
                    <strong>Role:</strong><br />
                    <span className="badge bg-danger">Administrator</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;