import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import InternshipCard from '../InternshipCard/InternshipCard';
import SkeletonCard from '../InternshipCard/SkeletonCard';
import PromotedCard from './PromotedCard';
import EmptyState from '../EmptyState/EmptyState';
import {
  INITIAL_VISIBLE_COUNT,
  LOAD_MORE_STEP,
  SKELETON_COUNT,
  SORT_OPTIONS,
} from '../../constants/filterOptions';

function sortInternships(internships, sortBy) {
  const sorted = [...internships];
  if (sortBy === 'stipend') {
    return sorted.sort((a, b) => b.stipendValue - a.stipendValue);
  }
  return sorted.sort((a, b) => (b.postedTimestamp || 0) - (a.postedTimestamp || 0));
}

const gridClass = 'flex flex-col gap-4';

function InternshipList(props) {
  const { internships, isLoading, error, isBookmarked, onToggleBookmark, emptyState, showPromoted } =
    props;
  const [sortBy, setSortBy] = useState('recent');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const sorted = useMemo(() => sortInternships(internships, sortBy), [internships, sortBy]);

  // Reset the window whenever the result set or sort order changes.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [internships, sortBy]);

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Couldn't load internships"
        message={error}
        actionLabel="Try again"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (sorted.length === 0) {
    return emptyState;
  }

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <section>
      <div className="mb-4 flex items-center justify-end gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="hidden sm:inline">Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={gridClass}>
        {showPromoted && <PromotedCard />}
        {visible.map((internship) => (
          <InternshipCard
            key={internship.id}
            internship={internship}
            isBookmarked={isBookmarked(internship.id)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
            className="rounded-lg border border-primary px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Load more
          </button>
        </div>
      )}
    </section>
  );
}

InternshipList.propTypes = {
  internships: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isBookmarked: PropTypes.func.isRequired,
  onToggleBookmark: PropTypes.func.isRequired,
  emptyState: PropTypes.node.isRequired,
  showPromoted: PropTypes.bool,
};

export default InternshipList;
