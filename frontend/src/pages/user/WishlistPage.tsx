import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import WishlistComponent from "../../components/Wishlist";

const WishlistPage: React.FC = () => {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleAddToCart = async (product: any): Promise<void> => {
    try {
      await axiosInstance.post('/cart/add', {
        userId: user?.id,
        productId: product._id,
        quantity: 1,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId: string): Promise<void> => {
    try {
      await axiosInstance.delete('/wishlist/remove', {
        data: { 
          productId 
        },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-4">
      <WishlistComponent
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
      />
    </div>
  );
};

export default WishlistPage;