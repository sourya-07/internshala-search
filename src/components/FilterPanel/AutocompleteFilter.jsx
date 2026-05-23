import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const MAX_SUGGESTIONS = 8;

// Text input with a suggestion dropdown (like Internshala's Profile / Location
// fields). Picking a suggestion adds it; chosen values show as removable chips.
function AutocompleteFilter(props) {
  const { label, placeholder, options, selected, onToggle } = props;
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return options
      .filter((option) => !selected.includes(option))
      .filter((option) => !trimmed || option.toLowerCase().includes(trimmed))
      .slice(0, MAX_SUGGESTIONS);
  }, [options, selected, query]);

  function handleSelect(option) {
    onToggle(option);
    setQuery('');
  }

  const showDropdown = isFocused && suggestions.length > 0;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-[11px] text-sm text-[#333333] outline-none transition-colors placeholder:text-slate-400 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        />
        {showDropdown && (
          <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-700">
            {suggestions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  // onMouseDown fires before the input's blur, so the pick registers.
                  onMouseDown={() => handleSelect(option)}
                  className="block w-full truncate px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {value}
              <span aria-hidden="true">×</span>
              <span className="sr-only">Remove {value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

AutocompleteFilter.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default AutocompleteFilter;
