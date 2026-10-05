import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getStoredWishlist,
  saveWishlist,
  subscribeToWishlist,
} from '../services/wishlistStorage';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isLiked: (productId: string) => boolean;
  toggleWishlist: (product: { id: string; name: string }) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>(getStoredWishlist);

  useEffect(() => {
    const unsub = subscribeToWishlist((ids) => setWishlistIds(ids));
    return unsub;
  }, []);

  const isLiked = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    (product: { id: string; name: string }) => {
      const currentlyLiked = wishlistIds.includes(product.id);
      const next = currentlyLiked
        ? wishlistIds.filter((id) => id !== product.id)
        : [...wishlistIds, product.id];

      saveWishlist(next);

      if (currentlyLiked) {
        showToast('Removed from wishlist', 'info', product.name);
      } else {
        showToast('Added to wishlist ❤️', 'success', product.name);
      }
    },
    [wishlistIds, showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const next = wishlistIds.filter((id) => id !== productId);
      saveWishlist(next);
      showToast('Removed from wishlist', 'info');
    },
    [wishlistIds, showToast]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isLiked,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
