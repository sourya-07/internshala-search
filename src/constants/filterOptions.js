// Central place for the values that drive filtering, fetching and pagination.
// Keeping them here avoids magic numbers/strings scattered across components.

// Base path for API requests. Proxied to Internshala by the Vite dev server
// (vite.config.js) locally and by the serverless function (/api) on Vercel.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Public listing page — richer cards (skills, stipend ranges, ~50 results).
export const LISTING_ENDPOINT = `${API_BASE}/internships`;
// Leaner JSON feed, used as a resilient fallback if the listing can't be parsed.
export const API_ENDPOINT = `${API_BASE}/hiring/search`;

// Internshala stores logos by filename; the client builds the full URL from this.
export const LOGO_BASE_URL = 'https://internshala-uploads.internshala.com/logo/';

export const SEARCH_DEBOUNCE_MS = 300;

// Simple windowing: render this many cards first, reveal more on demand.
export const INITIAL_VISIBLE_COUNT = 20;
export const LOAD_MORE_STEP = 12;

export const SKELETON_COUNT = 5;

export const BOOKMARKS_STORAGE_KEY = 'internshala:bookmarks';
export const THEME_STORAGE_KEY = 'internshala:theme';

export const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6].map((months) => ({
  value: months,
  label: `${months} Month${months > 1 ? 's' : ''}`,
}));

// Stipend filter is a slider (matches Internshala). minStipend filters on the
// monthly value; values above the max simply pass any lower minimum.
export const STIPEND_SLIDER = {
  min: 0,
  max: 10000,
  step: 1000,
  marks: [0, 2000, 4000, 6000, 8000, 10000],
};

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'stipend', label: 'Stipend: High to Low' },
];
