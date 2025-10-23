import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../components/Cart';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const CartPage: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleUpdateCart = async (productId: string, quantity: number): Promise<void> => {
    try {
      await axiosInstance.put('/cart/update', {
        userId: user?.id,
        productId,
        quantity
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveFromCart = async (productId: string): Promise<void> => {
    try {
      await axiosInstance.delete('/cart/remove', {
        data: {
          userId: user?.id,
          productId
        }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from cart');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mt-4">
      <Cart
        onUpdateCart={handleUpdateCart}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
};

export default CartPage;