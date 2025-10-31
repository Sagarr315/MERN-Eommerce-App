import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axiosInstance from "../../api/axiosInstance";
import "../../css/AdminProductPage.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaFolder,
  FaEdit,
  FaPlus,
  FaTimes,
  FaSave,
  FaImage,
  FaSpinner,
} from "react-icons/fa";

type Category = {
  _id: string;
  name: string;
  parentCategory?: string | null;
};

type FeaturedType =
  | "latest"
  | "new_arrival"
  | "trending"
  | "sale"
  | "seasonal"
  | "null";

const AdminProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Product States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">(0);
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [featuredType, setFeaturedType] = useState<FeaturedType>("null");
  const [featuredUntil, setFeaturedUntil] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  // Category Management States
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState<string>("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Check if we're in edit mode
  const isEditMode = !!id;

  // Fetch all categories on load AND product data if edit mode
  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories/admin/all");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to load categories");
    }
  };

  // Fetch product data for edit mode
  const fetchProductData = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      const product = res.data;

      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
      setCategory(product.category._id);
      setFeaturedType(product.featuredType || "null");
      setFeaturedUntil(
        product.featuredUntil ? product.featuredUntil.split("T")[0] : ""
      );
      setIsActive(product.isActive);
      setExistingImages(product.images || []);
    } catch (err) {
      console.error("Failed to load product data:", err);
      setError("Failed to load product data");
    }
  };

  // Create New Category
  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setCategoryLoading(true);
    setError(null);

    try {
      const payload = {
        name: newCategoryName.trim(),
        parentCategory: parentCategory || null,
      };

      await axiosInstance.post("/categories", payload);

      setSuccess("Category created successfully!");
      setNewCategoryName("");
      setParentCategory("");
      setShowCategoryForm(false);
      fetchCategories();
    } catch (err: any) {
      console.error("Category creation error:", err);
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setCategoryLoading(false);
    }
  };

  // Build nested category options for dropdown
  const buildCategoryOptions = (items: Category[]) => {
    const map = new Map<string | null, Category[]>();

    items.forEach((c) => {
      const key = c.parentCategory ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });

    const result: { id: string; label: string }[] = [];

    function buildOptions(parent: string | null, depth = 0) {
      const list = map.get(parent) || [];
      list.sort((a, b) => a.name.localeCompare(b.name));

      for (const item of list) {
        result.push({
          id: item._id,
          label: `${"── ".repeat(depth)}${item.name}`,
        });
        buildOptions(item._id, depth + 1);
      }
    }

    buildOptions(null);
    return result;
  };

  // Handle multiple image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // CORRECTED: PATCH for EDIT, FormData for CREATE
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title || !description || !price || !category) {
      setError("Please fill all required fields");
      return;
    }

    if (!isEditMode && images.length === 0) {
      setError("Please upload at least one product image");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isEditMode) {
        // EDIT MODE: Use PATCH with JSON (no images)
        const payload = {
          title,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
          isActive,
          featuredType: featuredType !== "null" ? featuredType : null,
          featuredUntil: featuredUntil || null,
        };

        await axiosInstance.patch(`/products/${id}`, payload); // CHANGED TO PATCH
        setSuccess("Product updated successfully!");
      } else {
        // CREATE MODE: Use FormData (with images)
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price.toString());
        formData.append("stock", stock.toString());
        formData.append("category", category);
        formData.append("isActive", String(isActive));

        if (featuredType !== "null") {
          formData.append("featuredType", featuredType);
        }
        if (featuredUntil) {
          formData.append("featuredUntil", featuredUntil);
        }

        images.forEach((image) => {
          formData.append("images", image);
        });

        await axiosInstance.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setSuccess("Product created successfully!");

        // Reset form for create mode
        setTitle("");
        setDescription("");
        setPrice("");
        setStock(0);
        setCategory("");
        setImages([]);
        setFeaturedType("null");
        setFeaturedUntil("");
        setIsActive(true);
      }
    } catch (err: any) {
      console.error("Product operation error:", err);
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} product`
      );
    } finally {
      setLoading(false);
    }
  };

  //  NEW: Handle updating images in edit mode
  const handleUpdateImages = async () => {
    if (images.length === 0) {
      setError("Please select at least one image to update");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      await axiosInstance.patch(`/products/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product images updated successfully!");
      setImages([]);
      fetchProductData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update images");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = buildCategoryOptions(categories);
  const mainCategories = categories.filter((cat) => !cat.parentCategory);

  return (
    <div className="admin-product-container mt-4">
      {/* Navigation Buttons */}
      <div className="admin-nav-card mb-3 m-4">
        <div className="admin-nav-buttons">
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/AdminProductsList")}
          >
            <FaBox className="me-2" />
            View All Products
          </button>
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/AdminCategoriesList")}
          >
            <FaFolder className="me-2" />
            View All Categories
          </button>
        </div>
      </div>

      <h2 className="admin-main-heading">
        {isEditMode ? (
          <>
            <FaEdit className="me-2" />
            Edit Product
          </>
        ) : (
          "Admin Product Management"
        )}
      </h2>

      {/* Category Management Section - Only show in create mode */}
      {!isEditMode && (
        <div className="admin-card category-management">
          <div className="admin-card-header">
            <h5 className="mb-0">
              <FaFolder className="me-2" />
              Category Management
            </h5>
            <span className="category-badge">
              {categories.length} categories
            </span>
          </div>
          <div className="card-body">
            {!showCategoryForm ? (
              <button
                className="admin-btn-outline m-2"
                onClick={() => setShowCategoryForm(true)}
              >
                <FaPlus className="me-2" />
                Add New Category
              </button>
            ) : (
              <form
                onSubmit={handleCreateCategory}
                className="category-form-row m-3"
              >
                <div className="category-form-col ">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Silk Sarees, Kids Dresses"
                    required
                  />
                </div>

                <div className="category-form-col">
                  <label className="form-label">Parent Category</label>
                  <select
                    className="form-select"
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                  >
                    <option value="">Main Category (No Parent)</option>
                    {mainCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Select parent for subcategory, or leave empty for main
                    category
                  </small>
                </div>

                <div className="category-form-actions">
                  <button
                    type="submit"
                    className="admin-btn-success"
                    disabled={categoryLoading || !newCategoryName.trim()}
                  >
                    {categoryLoading ? (
                      <FaSpinner className="spinner-border-sm me-2" />
                    ) : (
                      <FaSave className="me-2" />
                    )}
                    {categoryLoading ? "Creating..." : "Add Category"}
                  </button>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    onClick={() => {
                      setShowCategoryForm(false);
                      setNewCategoryName("");
                      setParentCategory("");
                    }}
                  >
                    <FaTimes className="me-2" />
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Categories Hierarchy Display */}
            {categories.length > 0 && (
              <div className="mt-4">
                <h6 className="text-muted mb-1 ms-2">Current Categories:</h6>
                <div className="category-tree m-3">
                  {mainCategories.map((mainCat) => (
                    <div key={mainCat._id} className="mb-2">
                      <div className="fw-bold text-primary">
                        <FaFolder className="me-2" />
                        {mainCat.name}
                      </div>
                      {categories
                        .filter(
                          (subCat) =>
                            subCat.parentCategory?.toString() ===
                            mainCat._id.toString()
                        )
                        .map((subCat) => (
                          <div key={subCat._id} className="ms-3 text-success">
                            <FaFolder className="me-2" />
                            {subCat.name}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Creation/Edit Form */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h5 className="form-section-heading">
          {isEditMode ? (
            <>
              <FaEdit className="me-2" />
              Edit Product Details
            </>
          ) : (
            <>
              <FaPlus className="me-2" />
              Add New Product
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
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product features, material, size, etc."
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min="0"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category & Media */}
          <div>
            <div className="mb-3">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={categories.length === 0}
              >
                <option value="">
                  {categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </option>
                {categoryOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <div className="text-danger small mt-1">
                  Please create a category first before adding products.
                </div>
              )}
            </div>

            {/* Featured Settings */}
            <div className="mb-3">
              <label className="form-label">Featured Settings</label>
              <div className="row g-2">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={featuredType}
                    onChange={(e) =>
                      setFeaturedType(e.target.value as FeaturedType)
                    }
                  >
                    <option value="null">Not Featured</option>
                    <option value="latest">Latest</option>
                    <option value="new_arrival">New Arrival</option>
                    <option value="trending">Trending</option>
                    <option value="sale">Sale</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <input
                    type="date"
                    className="form-control"
                    value={featuredUntil}
                    onChange={(e) => setFeaturedUntil(e.target.value)}
                    placeholder="Featured until"
                  />
                </div>
              </div>
              <small className="text-muted">
                Set featured type and expiration date for homepage showcasing
              </small>
            </div>

            {/* Active Toggle */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label className="form-check-label">Product Active</label>
            </div>

            {/* Image Section */}
            {isEditMode ? (
              <>
                {/* EDIT MODE: Image update */}
                <div className="mb-3">
                  <label className="form-label">Update Images</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">
                    Select new images to add to existing ones
                  </small>
                  {images.length > 0 && (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="admin-btn-success admin-btn-sm"
                        onClick={handleUpdateImages}
                        disabled={loading}
                      >
                        <FaImage className="me-2" />
                        {loading ? "Updating..." : "Update Images"}
                      </button>
                      <small className="text-success ms-2">
                        {images.length} new image(s) selected
                      </small>
                    </div>
                  )}
                </div>

                {/* Existing Images Display */}
                {existingImages.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Existing Images</label>
                    <div className="image-preview-container">
                      {existingImages.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="image-preview"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* CREATE MODE: Required image upload */
              <div className="mb-3">
                <label className="form-label">Product Images *</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required
                />
                <small className="text-muted">
                  You can select multiple images. First image will be the main
                  display image.
                </small>
                {images.length > 0 && (
                  <div className="mt-2">
                    <small className="text-success">
                      <FaImage className="me-1" />
                      {images.length} image(s) selected
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={loading || categories.length === 0}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner-border-sm me-2" />
                {isEditMode ? "Updating Product..." : "Creating Product..."}
              </>
            ) : isEditMode ? (
              <>
                <FaSave className="me-2" />
                Update Product Details
              </>
            ) : (
              <>
                <FaPlus className="me-2" />
                Create Product
              </>
            )}
          </button>
          {categories.length === 0 && (
            <div className="text-center text-danger mt-2">
              Please create at least one category before adding products
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminProductPage;
