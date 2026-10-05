const WISHLIST_STORAGE_KEY = 'marshall_wishlist_v1';
const WISHLIST_EVENT = 'marshall_wishlist_updated';

// Default liked item IDs on first load
const INITIAL_WISHLIST: string[] = ['prod-01', 'prod-04'];

export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(INITIAL_WISHLIST));
      return INITIAL_WISHLIST;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(INITIAL_WISHLIST));
    return INITIAL_WISHLIST;
  } catch (err) {
    console.error('Failed to read wishlist from localStorage:', err);
    return INITIAL_WISHLIST;
  }
}

export function saveWishlist(ids: string[]): void {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: ids }));
  } catch (err) {
    console.error('Failed to save wishlist to localStorage:', err);
  }
}

export function toggleWishlistStorage(productId: string): boolean {
  const current = getStoredWishlist();
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  saveWishlist(updated);
  return !exists;
}

export function isProductLiked(productId: string): boolean {
  const current = getStoredWishlist();
  return current.includes(productId);
}

export function subscribeToWishlist(callback: (ids: string[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<string[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredWishlist());
    }
  };

  window.addEventListener(WISHLIST_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(WISHLIST_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
