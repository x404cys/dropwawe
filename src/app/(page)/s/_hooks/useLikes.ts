// Purpose: useLikes hook — manages set of liked product IDs.
// Kept standalone for components not needing full CartContext.

'use client';

import { useState } from 'react';

export function useLikes() {
  const [liked, setLiked] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLiked(prev => (prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]));
  };

  return { liked, toggleLike };
}
