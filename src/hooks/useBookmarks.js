import { useCallback, useEffect, useState } from 'react';
import { BOOKMARKS_STORAGE_KEY } from '../constants/filterOptions';

function readStoredBookmarks() {
  try {
    const stored = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    // Corrupted or unavailable storage shouldn't take the whole app down.
    return [];
  }
}

// Tracks bookmarked internship ids and mirrors them to localStorage so saved
// internships survive a page refresh.
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(readStoredBookmarks);

  useEffect(() => {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((id) => {
    setBookmarks((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const isBookmarked = useCallback((id) => bookmarks.includes(id), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
