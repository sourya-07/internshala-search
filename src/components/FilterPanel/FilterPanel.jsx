import { useState } from 'react';
import PropTypes from 'prop-types';
import { HelpCircle } from 'lucide-react';
import AutocompleteFilter from './AutocompleteFilter';
import StipendSlider from './StipendSlider';
import SearchBar from '../SearchBar/SearchBar';
import { DURATION_OPTIONS } from '../../constants/filterOptions';

const inputClass =
  'h-10 w-full rounded-md border border-slate-300 bg-white px-[11px] text-sm text-[#333333] outline-none transition-colors placeholder:text-slate-400 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100';

const sectionLabelClass = 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200';

function CheckRow(props) {
  const { label, checked, onChange, hint } = props;
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
      />
      {label}
      {hint && (
        <span title={hint} className="text-slate-400">
          <HelpCircle className="h-3.5 w-3.5" />
        </span>
      )}
    </label>
  );
}

CheckRow.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  hint: PropTypes.string,
};

function FilterPanel(props) {
  const {
    filters,
    profileOptions,
    locationOptions,
    keywordValue,
    onToggleFilter,
    onSetFilter,
    onSearch,
    onClearFilters,
  } = props;
  const [asPerPreferences, setAsPerPreferences] = useState(true);
  // The public listing has no data behind these, so they're presentational only.
  const [startDate, setStartDate] = useState('');
  const [extras, setExtras] = useState({ fastResponse: false, earlyApplicant: false, women: false });
  const toggleExtra = (key) => setExtras((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="rounded-xl border border-slate-200 bg-card p-[23px] text-[#333333] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
      <div className="mb-4 flex items-center justify-center gap-2">
        <FilterIcon />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Filters</h2>
      </div>

      <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={asPerPreferences}
          onChange={() => setAsPerPreferences((value) => !value)}
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
        As per my <span className="font-medium text-primary">preferences</span>
      </label>

      <div className="space-y-4">
        <AutocompleteFilter
          label="Profile"
          placeholder="e.g. Marketing"
          options={profileOptions}
          selected={filters.profiles}
          onToggle={(value) => onToggleFilter('profiles', value)}
        />
        <AutocompleteFilter
          label="Location"
          placeholder="e.g. Delhi"
          options={locationOptions}
          selected={filters.locations}
          onToggle={(value) => onToggleFilter('locations', value)}
        />

        <div className="space-y-2">
          <CheckRow
            label="Work from home"
            checked={filters.workFromHome}
            onChange={() => onSetFilter('workFromHome', !filters.workFromHome)}
          />
          <CheckRow
            label="Part-time"
            checked={filters.partTime}
            onChange={() => onSetFilter('partTime', !filters.partTime)}
          />
        </div>

        <div>
          <p className={sectionLabelClass}>Desired minimum monthly stipend (₹)</p>
          <StipendSlider
            value={filters.minStipend}
            onChange={(value) => onSetFilter('minStipend', value)}
          />
        </div>

        <div>
          <label htmlFor="filter-start-date" className={sectionLabelClass}>
            Starting from (or after)
          </label>
          <input
            id="filter-start-date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="filter-max-duration" className={sectionLabelClass}>
            Max. duration (months)
          </label>
          <select
            id="filter-max-duration"
            value={filters.maxDuration || ''}
            onChange={(event) => onSetFilter('maxDuration', Number(event.target.value) || 0)}
            className={`${inputClass} ${filters.maxDuration ? '' : 'text-slate-400'}`}
          >
            <option value="">Choose duration</option>
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <CheckRow
            label="Internships with job offer"
            checked={filters.hasJobOffer}
            onChange={() => onSetFilter('hasJobOffer', !filters.hasJobOffer)}
            hint="Show only internships that come with a pre-placement job offer"
          />
          <CheckRow
            label="Fast response"
            checked={extras.fastResponse}
            onChange={() => toggleExtra('fastResponse')}
            hint="Employers who respond to applications quickly"
          />
          <CheckRow
            label="Early applicant"
            checked={extras.earlyApplicant}
            onChange={() => toggleExtra('earlyApplicant')}
            hint="Internships you can be among the first to apply to"
          />
          <CheckRow
            label="Internships for women"
            checked={extras.women}
            onChange={() => toggleExtra('women')}
            hint="Internships open to or preferred for women"
          />
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-3 dark:border-slate-700">
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Clear all
          </button>
        </div>

        <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Keyword Search
          </p>
          <SearchBar value={keywordValue} onSearch={onSearch} placeholder="e.g. Design, Python" />
        </div>
      </div>
    </div>
  );
}

FilterPanel.propTypes = {
  filters: PropTypes.shape({
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    locations: PropTypes.arrayOf(PropTypes.string).isRequired,
    maxDuration: PropTypes.number.isRequired,
    hasJobOffer: PropTypes.bool.isRequired,
    workFromHome: PropTypes.bool.isRequired,
    partTime: PropTypes.bool.isRequired,
    minStipend: PropTypes.number.isRequired,
  }).isRequired,
  profileOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  locationOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  keywordValue: PropTypes.string.isRequired,
  onToggleFilter: PropTypes.func.isRequired,
  onSetFilter: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

function FilterIcon() {
  return (
    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export default FilterPanel;
