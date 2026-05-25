import PropTypes from 'prop-types';

// Flattens the active filters into a single list of removable chips. Each chip
// carries the filter key + value so the parent knows exactly what to remove.
function buildChips(filters) {
  const chips = [];

  if (filters.keyword.trim()) {
    chips.push({ key: 'keyword', value: filters.keyword, label: `"${filters.keyword.trim()}"` });
  }
  filters.profiles.forEach((profile) => {
    chips.push({ key: 'profiles', value: profile, label: profile });
  });
  if (filters.workFromHome) {
    chips.push({ key: 'workFromHome', value: true, label: 'Work from home' });
  }
  if (filters.partTime) {
    chips.push({ key: 'partTime', value: true, label: 'Part-time' });
  }
  filters.locations.forEach((location) => {
    chips.push({ key: 'locations', value: location, label: location });
  });
  if (filters.maxDuration > 0) {
    chips.push({
      key: 'maxDuration',
      value: filters.maxDuration,
      label: `Up to ${filters.maxDuration} month${filters.maxDuration > 1 ? 's' : ''}`,
    });
  }
  if (filters.hasJobOffer) {
    chips.push({ key: 'hasJobOffer', value: true, label: 'With job offer' });
  }
  if (filters.minStipend > 0) {
    chips.push({
      key: 'minStipend',
      value: filters.minStipend,
      label: `Stipend ₹${filters.minStipend.toLocaleString('en-IN')}+`,
    });
  }

  return chips;
}

function ActiveFilterChips(props) {
  const { filters, onRemove, onClearAll } = props;
  const chips = buildChips(filters);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.key}:${chip.value}`}
          type="button"
          onClick={() => onRemove(chip.key, chip.value)}
          className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          <span className="max-w-[12rem] truncate">{chip.label}</span>
          <span aria-hidden="true" className="text-slate-400 group-hover:text-primary">
            ×
          </span>
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
      >
        Clear all
      </button>
    </div>
  );
}

ActiveFilterChips.propTypes = {
  filters: PropTypes.shape({
    keyword: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    locations: PropTypes.arrayOf(PropTypes.string).isRequired,
    maxDuration: PropTypes.number.isRequired,
    hasJobOffer: PropTypes.bool.isRequired,
    workFromHome: PropTypes.bool.isRequired,
    partTime: PropTypes.bool.isRequired,
    minStipend: PropTypes.number.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default ActiveFilterChips;
