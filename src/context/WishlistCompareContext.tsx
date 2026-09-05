'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistCompareContextType {
  wishlistIds: string[];
  compareIds: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  clearWishlist: () => void;
}

const WishlistCompareContext = createContext<WishlistCompareContextType | undefined>(undefined);

export const WishlistCompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('kpn_wishlist');
      const savedCompare = localStorage.getItem('kpn_compare');
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
      if (savedCompare) setCompareIds(JSON.parse(savedCompare));
    } catch (e) {
      console.error('Error loading wishlist/compare state:', e);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('kpn_wishlist', JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('kpn_compare', JSON.stringify(compareIds));
    }
  }, [compareIds, isMounted]);

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlistIds.includes(id);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 projects at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const isInCompare = (id: string) => compareIds.includes(id);

  const clearCompare = () => setCompareIds([]);
  const clearWishlist = () => setWishlistIds([]);

  return (
    <WishlistCompareContext.Provider
      value={{
        wishlistIds,
        compareIds,
        toggleWishlist,
        isInWishlist,
        toggleCompare,
        isInCompare,
        clearCompare,
        clearWishlist,
      }}
    >
      {children}
    </WishlistCompareContext.Provider>
  );
};

const defaultContext: WishlistCompareContextType = {
  wishlistIds: [],
  compareIds: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
  toggleCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
  clearWishlist: () => {},
};

export const useWishlistCompare = () => {
  const context = useContext(WishlistCompareContext);
  return context || defaultContext;
};
