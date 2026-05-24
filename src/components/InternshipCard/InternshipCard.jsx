import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import BookmarkButton from '../BookmarkButton/BookmarkButton';
import { formatStipend, getInitials, getPostedAgo } from '../../utils/formatters';

function CardDetail(props) {
  const { icon, children } = props;
  return (
    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
      <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
}

CardDetail.propTypes = {
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

function InternshipCard(props) {
  const { internship, isBookmarked, onToggleBookmark } = props;
  const [logoFailed, setLogoFailed] = useState(false);

  const showLogo = internship.logoUrl && !logoFailed;
  const locationText = internship.isWorkFromHome
    ? 'Work from home'
    : internship.locations.join(', ') || 'Location not specified';
  const postedText = internship.postedLabel || getPostedAgo(internship.postedTimestamp);
  const postedIsFresh = internship.postedLabelType === 'success';

  return (
    <article className="group relative rounded-lg border border-slate-200 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#333333] dark:text-slate-100">
            {internship.applyUrl ? (
              <a
                href={internship.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {internship.title}
              </a>
            ) : (
              internship.title
            )}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {internship.companyName}
            </span>
            {internship.isActivelyHiring && (
              <span className="rounded-full border border-primary/40 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                Actively hiring
              </span>
            )}
          </div>
        </div>

        {showLogo ? (
          <img
            src={internship.logoUrl}
            alt={`${internship.companyName} logo`}
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className="h-14 w-14 shrink-0 rounded-md border border-slate-100 object-contain dark:border-slate-700"
          />
        ) : (
          // Fall back to a neutral initials tile when the logo URL is broken.
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-400 dark:bg-slate-700 dark:text-slate-400">
            {getInitials(internship.companyName)}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <CardDetail icon={<HomeIcon />}>{locationText}</CardDetail>
        <CardDetail icon={<StipendIcon />}>
          {internship.stipendLabel || formatStipend(internship.stipendValue)}
        </CardDetail>
        <CardDetail icon={<CalendarIcon />}>{internship.durationLabel || '—'}</CardDetail>
        {internship.startDate && <CardDetail icon={<RocketIcon />}>{internship.startDate}</CardDetail>}
      </div>

      {internship.skills?.length > 0 && (
        <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
          {internship.skills.join('  •  ')}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {postedText && (
            <span
              className={`flex items-center gap-1.5 text-sm font-medium ${
                postedIsFresh ? 'text-success' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <ClockIcon />
              {postedText}
            </span>
          )}
          {internship.hasJobOffer && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-offer">
              <BagIcon />
              {internship.jobOfferLabel}
            </span>
          )}
        </div>
        <BookmarkButton
          isBookmarked={isBookmarked}
          onToggle={() => onToggleBookmark(internship.id)}
        />
      </div>
    </article>
  );
}

InternshipCard.propTypes = {
  internship: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    isWorkFromHome: PropTypes.bool.isRequired,
    locations: PropTypes.arrayOf(PropTypes.string).isRequired,
    durationLabel: PropTypes.string.isRequired,
    stipendLabel: PropTypes.string,
    stipendValue: PropTypes.number.isRequired,
    startDate: PropTypes.string,
    isActivelyHiring: PropTypes.bool.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string),
    hasJobOffer: PropTypes.bool,
    jobOfferLabel: PropTypes.string,
    postedLabel: PropTypes.string,
    postedLabelType: PropTypes.string,
    applyUrl: PropTypes.string,
  }).isRequired,
  isBookmarked: PropTypes.bool.isRequired,
  onToggleBookmark: PropTypes.func.isRequired,
};

const iconClass = 'h-4 w-4';
const iconProps = {
  className: iconClass,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function StipendIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <circle cx="12" cy="12.5" r="2.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 13l4 4M4 20l3-1M14 4s5 1 7 3-1 7-1 7l-6-3-3-6z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// Memoised because the list can re-render on unrelated state changes.
export default memo(InternshipCard);
