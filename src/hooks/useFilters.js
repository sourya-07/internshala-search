import { useCallback, useMemo, useReducer } from 'react';
import { applyAllFilters } from '../utils/filters';

export const INITIAL_FILTERS = {
  keyword: '',
  profiles: [],
  locations: [],
  workFromHome: false,
  partTime: false,
  minStipend: 0,
  maxDuration: 0, // 0 = any; otherwise keep internships of at most this many months
  hasJobOffer: false,
};

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

// A reducer keeps the multi-field filter updates (set / toggle / remove / clear)
// in one predictable place instead of juggling several useState setters.
function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.key]: action.value };
    case 'TOGGLE':
      return { ...state, [action.key]: toggleValue(state[action.key], action.value) };
    case 'REMOVE':
      return { ...state, [action.key]: state[action.key].filter((item) => item !== action.value) };
    case 'CLEAR':
      return INITIAL_FILTERS;
    default:
      return state;
  }
}

export function useFilters(internships) {
  const [filters, dispatch] = useReducer(filtersReducer, INITIAL_FILTERS);

  const setFilter = useCallback((key, value) => dispatch({ type: 'SET', key, value }), []);
  const toggleFilter = useCallback((key, value) => dispatch({ type: 'TOGGLE', key, value }), []);
  const removeFilter = useCallback((key, value) => dispatch({ type: 'REMOVE', key, value }), []);
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  // Recompute the filtered list only when the data or the filters actually change.
  const filteredInternships = useMemo(
    () => applyAllFilters(internships, filters),
    [internships, filters],
  );

  const activeFilterCount = useMemo(
    () =>
      filters.profiles.length +
      filters.locations.length +
      (filters.maxDuration > 0 ? 1 : 0) +
      (filters.hasJobOffer ? 1 : 0) +
      (filters.workFromHome ? 1 : 0) +
      (filters.partTime ? 1 : 0) +
      (filters.minStipend > 0 ? 1 : 0),
    [filters],
  );

  return {
    filters,
    setFilter,
    toggleFilter,
    removeFilter,
    clearFilters,
    filteredInternships,
    activeFilterCount,
  };
}
