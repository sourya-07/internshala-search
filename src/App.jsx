import { useCallback, useMemo, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import FilterPanel from './components/FilterPanel/FilterPanel';
import ActiveFilterChips from './components/FilterPanel/ActiveFilterChips';
import InternshipList from './components/InternshipList/InternshipList';
import EmptyState from './components/EmptyState/EmptyState';
import { useInternships } from './hooks/useInternships';
import { useFilters } from './hooks/useFilters';
import { useBookmarks } from './hooks/useBookmarks';

function getUniqueSorted(values) {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function App() {
  const { internships, isLoading, error } = useInternships();
  const {
    filters,
    setFilter,
    toggleFilter,
    removeFilter,
    clearFilters,
    filteredInternships,
    activeFilterCount,
  } = useFilters(internships);
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter options are derived from the data so they always match what's loaded.
  const profileOptions = useMemo(
    () => getUniqueSorted(internships.map((internship) => internship.profile)),
    [internships],
  );
  const locationOptions = useMemo(
    () => getUniqueSorted(internships.flatMap((internship) => internship.locations)),
    [internships],
  );

  const handleSearch = useCallback((keyword) => setFilter('keyword', keyword), [setFilter]);
  const handleToggleSaved = useCallback(() => setShowSavedOnly((value) => !value), []);
  const handleGoToInternships = useCallback(() => setShowSavedOnly(false), []);

  const handleRemoveFilter = useCallback(
    (key, value) => {
      if (key === 'keyword') {
        setFilter('keyword', '');
      } else if (key === 'workFromHome') {
        setFilter('workFromHome', false);
      } else if (key === 'partTime') {
        setFilter('partTime', false);
      } else if (key === 'hasJobOffer') {
        setFilter('hasJobOffer', false);
      } else if (key === 'minStipend') {
        setFilter('minStipend', 0);
      } else if (key === 'maxDuration') {
        setFilter('maxDuration', 0);
      } else {
        removeFilter(key, value);
      }
    },
    [setFilter, removeFilter],
  );

  const visibleInternships = useMemo(() => {
    if (!showSavedOnly) {
      return filteredInternships;
    }
    return filteredInternships.filter((internship) => bookmarks.includes(internship.id));
  }, [showSavedOnly, filteredInternships, bookmarks]);

  const hasAnyFilter = activeFilterCount > 0 || filters.keyword.trim().length > 0;

  let emptyState;
  if (showSavedOnly && bookmarks.length === 0) {
    emptyState = (
      <EmptyState
        title="No saved internships yet"
        message="Tap the bookmark icon on any internship to save it here for later."
      />
    );
  } else if (showSavedOnly) {
    emptyState = (
      <EmptyState
        title="No saved internships match your filters"
        message="Adjust your filters to see the internships you've saved."
      />
    );
  } else {
    emptyState = (
      <EmptyState
        title="No internships match your filters"
        message="Try removing a filter or two to widen your search."
        actionLabel={hasAnyFilter ? 'Clear all filters' : undefined}
        onAction={hasAnyFilter ? clearFilters : undefined}
      />
    );
  }

  const filterProps = {
    filters,
    profileOptions,
    locationOptions,
    keywordValue: filters.keyword,
    onToggleFilter: toggleFilter,
    onSetFilter: setFilter,
    onSearch: handleSearch,
    onClearFilters: clearFilters,
  };

  const countTitle = isLoading
    ? 'Loading internships…'
    : `${visibleInternships.length} Total ${visibleInternships.length === 1 ? 'Internship' : 'Internships'}`;

  return (
    <div className="min-h-screen bg-surface text-slate-800 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
      <Navbar
        savedCount={bookmarks.length}
        showSavedOnly={showSavedOnly}
        onToggleSaved={handleToggleSaved}
        onGoToInternships={handleGoToInternships}
      />

      {/* internships_list_container: 48px top / 16px side padding; content capped at 1224px */}
      <main className="px-4 pb-10 pt-12">
        <div className="mx-auto max-w-[1224px]">
          {/* Heading is centred over the results column (offset past the filter sidebar) */}
          <div className="lg:flex lg:gap-6">
            <div className="hidden w-[316px] shrink-0 lg:block" aria-hidden="true" />
            <header className="flex-1 text-center">
              <h1 className="mb-2 text-[18px] font-semibold text-[#333333] dark:text-slate-100">
                {countTitle}
              </h1>
              <p className="my-4 text-[12px] text-[#484848] dark:text-slate-400">
                Latest Summer Internships
              </p>
            </header>
          </div>

          <div className="lg:flex lg:items-start lg:gap-6">
            <aside className="hidden w-[316px] shrink-0 lg:block">
              <FilterPanel {...filterProps} />
            </aside>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 lg:hidden dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <ActiveFilterChips
              filters={filters}
              onRemove={handleRemoveFilter}
              onClearAll={clearFilters}
            />

            <InternshipList
              internships={visibleInternships}
              isLoading={isLoading}
              error={error}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              emptyState={emptyState}
              showPromoted={!showSavedOnly}
            />
          </div>
        </div>
        </div>
      </main>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-surface p-4 dark:bg-slate-900">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>
            <FilterPanel {...filterProps} />
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Show {visibleInternships.length} results
            </button>
          </div>
        </div>
      )}

      <ThemeToggle />
    </div>
  );
}

export default App;

// SearchBar integrated – debounce delay 300ms (2026-05-22)

// useInternships hook wired to App-level state (2026-05-23)

// ThemeToggle: persists preference to localStorage (2026-05-24)
