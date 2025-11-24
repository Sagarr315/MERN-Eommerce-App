import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axiosInstance from "../../api/axiosInstance";
import "../../css/AdminHomeContent.css";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaEdit,
  FaPlus,
  FaTimes,
  FaSave,
  FaImage,
  FaVideo,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";

type HomeContent = {
  _id: string;
  sectionType: 'hero' | 'advertisement';
  position: number;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

const AdminHomeContent: React.FC = () => {
  const navigate = useNavigate();

  // Form States
  const [sectionType, setSectionType] = useState<'hero' | 'advertisement'>('hero');
  const [position, setPosition] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Data States
  const [homeContents, setHomeContents] = useState<HomeContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch all home content on load
  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      setFetchLoading(true);
      const res = await axiosInstance.get("/home-content");
      setHomeContents(res.data);
    } catch (err) {
      console.error("Failed to load home content:", err);
      setError("Failed to load home content");
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle media file change
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  // Reset form
  const resetForm = () => {
    setSectionType('hero');
    setPosition(1);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setButtonText("");
    setButtonLink("");
    setIsActive(true);
    setMediaFile(null);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (sectionType === 'hero' && !mediaFile && !editingId) {
      setError("Please upload an image or video for hero banner");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("sectionType", sectionType);
      formData.append("position", position.toString());
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      formData.append("buttonText", buttonText);
      formData.append("buttonLink", buttonLink);
      formData.append("isActive", isActive.toString());

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      if (editingId) {
        // Update existing
        await axiosInstance.put(`/home-content/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Home content updated successfully!");
      } else {
        // Create new
        await axiosInstance.post("/home-content", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Home content created successfully!");
      }

      resetForm();
      fetchHomeContent();
    } catch (err: any) {
      console.error("Home content operation error:", err);
      setError(
        err.response?.data?.message ||
          `Failed to ${editingId ? "update" : "create"} home content`
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit home content
  const handleEdit = (content: HomeContent) => {
    setEditingId(content._id);
    setSectionType(content.sectionType);
    setPosition(content.position);
    setTitle(content.title || "");
    setSubtitle(content.subtitle || "");
    setDescription(content.description || "");
    setButtonText(content.buttonText || "");
    setButtonLink(content.buttonLink || "");
    setIsActive(content.isActive);
    setMediaFile(null);
    setError(null);
    setSuccess(null);

    // Scroll to form
    document.getElementById('home-content-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete home content
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this content?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/home-content/${id}`);
      setSuccess("Home content deleted successfully!");
      fetchHomeContent();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete home content");
    }
  };

  // Get position label
  const getPositionLabel = (sectionType: string, position: number) => {
    if (sectionType === 'hero') return "Hero Banner (Top)";
    
    switch (position) {
      case 1: return "Advertisement 1 (After New Arrivals)";
      case 2: return "Advertisement 2 (After Trending)";
      case 3: return "Advertisement 3 (Bottom)";
      default: return `Advertisement ${position}`;
    }
  };

  return (
    <div className="admin-home-content-container mt-4">
      {/* Navigation */}
      <div className="admin-nav-card mb-3 m-4">
        <div className="admin-nav-buttons">
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/AdminProductsList")}
          >
            <FaHome className="me-2" />
            Manage Products
          </button>
        </div>
      </div>

      <h2 className="admin-main-heading">
        <FaHome className="me-2" />
        Home Content Management
      </h2>

      {/* Current Home Content List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h5 className="mb-0">Current Home Content</h5>
          <span className="category-badge">
            {homeContents.length} items
          </span>
        </div>
        <div className="card-body">
          {fetchLoading ? (
            <div className="text-center py-4">
              <FaSpinner className="spinner-border-lg me-2" />
              Loading...
            </div>
          ) : homeContents.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No home content found. Create your first banner!
            </div>
          ) : (
            <div className="home-content-list">
              {homeContents.map((content) => (
                <div key={content._id} className="home-content-item">
                  <div className="home-content-info">
                    <div className="home-content-header">
                      <h6 className="mb-1">{content.title || "No Title"}</h6>
                      <span className={`badge ${content.sectionType === 'hero' ? 'bg-primary' : 'bg-success'}`}>
                        {getPositionLabel(content.sectionType, content.position)}
                      </span>
                    </div>
                    <p className="text-muted mb-2 small">
                      {content.subtitle || "No subtitle"}
                    </p>
                    <div className="home-content-meta">
                      <span className={`status-badge ${content.isActive ? 'active' : 'inactive'}`}>
                        {content.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-muted small">
                        Updated: {new Date(content.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="home-content-actions">
                    <button
                      className="admin-btn-outline admin-btn-sm"
                      onClick={() => handleEdit(content)}
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </button>
                    <button
                      className="admin-btn-danger admin-btn-sm"
                      onClick={() => handleDelete(content._id)}
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      <form id="home-content-form" onSubmit={handleSubmit} className="admin-form">
        <h5 className="form-section-heading">
          {editingId ? (
            <>
              <FaEdit className="me-2" />
              Edit Home Content
            </>
          ) : (
            <>
              <FaPlus className="me-2" />
              Add New Home Content
            </>
          )}
        </h5>

        {error && (
          <div className="alert alert-danger">
            <FaTimes />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <FaSave />
            <span>{success}</span>
          </div>
        )}

        <div className="admin-row admin-col-2">
          {/* Basic Information */}
          <div>
            <div className="mb-3">
              <label className="form-label">Section Type *</label>
              <select
                className="form-select"
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value as 'hero' | 'advertisement')}
                required
              >
                <option value="hero">Hero Banner (Top)</option>
                <option value="advertisement">Advertisement Banner</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Position *
                <small className="text-muted ms-2">
                  {sectionType === 'hero' 
                    ? 'Hero always appears at top' 
                    : '1=After New Arrivals, 2=After Trending, 3=Bottom'
                  }
                </small>
              </label>
              <select
                className="form-select"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                required
                disabled={sectionType === 'hero'}
              >
                {sectionType === 'hero' ? (
                  <option value={1}>Top (Hero Banner)</option>
                ) : (
                  <>
                    <option value={1}>Position 1 (After New Arrivals)</option>
                    <option value={2}>Position 2 (After Trending)</option>
                    <option value={3}>Position 3 (Bottom)</option>
                  </>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter banner title"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Subtitle</label>
              <input
                type="text"
                className="form-control"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>

          {/* Media & Actions */}
          <div>
            <div className="mb-3">
              <label className="form-label">Button Text</label>
              <input
                type="text"
                className="form-control"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g., Shop Now, Learn More"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Button Link</label>
              <input
                type="text"
                className="form-control"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                placeholder="e.g., /products, /sale"
              />
            </div>

            {/* Media Upload */}
            <div className="mb-3">
              <label className="form-label">
                {sectionType === 'hero' ? 'Hero Media (Image/Video) *' : 'Advertisement Image'}
                {!editingId && sectionType === 'hero' && (
                  <small className="text-muted ms-2">Required for new hero banner</small>
                )}
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                required={!editingId && sectionType === 'hero'}
              />
              <small className="text-muted">
                {sectionType === 'hero' 
                  ? 'Upload image or video for hero banner' 
                  : 'Upload image for advertisement'
                }
              </small>
              {mediaFile && (
                <div className="mt-2">
                  <small className="text-success">
                    {mediaFile.type.startsWith('image/') ? <FaImage /> : <FaVideo />}
                    {mediaFile.name} selected
                  </small>
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label className="form-check-label">Content Active</label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions mt-4">
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner-border-sm me-2" />
                {editingId ? "Updating..." : "Creating..."}
              </>
            ) : editingId ? (
              <>
                <FaSave className="me-2" />
                Update Content
              </>
            ) : (
              <>
                <FaPlus className="me-2" />
                Create Content
              </>
            )}
          </button>
          
          {editingId && (
            <button
              type="button"
              className="admin-btn-outline"
              onClick={resetForm}
              disabled={loading}
            >
              <FaTimes className="me-2" />
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminHomeContent;