import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SEARCH_DEBOUNCE_MS } from '../../constants/filterOptions';

function SearchBar(props) {
  const { value, onSearch, placeholder = 'Search by role, company or city' } = props;
  const [draft, setDraft] = useState(value);
  const lastEmitted = useRef(value);

  // Debounce prevents excessive re-filtering while the user is still typing.
  useEffect(() => {
    const timerId = setTimeout(() => {
      lastEmitted.current = draft;
      onSearch(draft);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timerId);
  }, [draft, onSearch]);

  // If the term is reset from the outside (e.g. "Clear all"), mirror it locally
  // without clobbering whatever the user is currently typing.
  useEffect(() => {
    if (value !== lastEmitted.current) {
      setDraft(value);
      lastEmitted.current = value;
    }
  }, [value]);

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label="Search internships"
        className="h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-sm text-[#333333] outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
