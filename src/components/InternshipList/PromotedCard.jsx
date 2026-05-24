// Static promotional card that mirrors the "Promoted" course banner Internshala
// pins to the top of its listing. It isn't internship data, so it lives apart
// from the fetched results.
function PromotedCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-card p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="font-semibold text-slate-800 dark:text-slate-100">
        Get hired for Data Science <span className="font-normal text-slate-400">• Promoted</span>
      </p>
      <span className="mt-2 inline-block rounded bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
        Online Course with Placement Assistance
      </span>

      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <li className="flex items-center gap-2">
          <KeyIcon />
          Upskill &amp; stand out as <strong className="font-semibold">top applicant</strong>
        </li>
        <li className="flex items-center gap-2">
          <BriefcaseIcon />
          Get <strong className="font-semibold">priority access</strong> to top opportunities
        </li>
        <li className="flex items-center gap-2">
          <VideoIcon />
          <span>
            <strong className="font-semibold">Role specific</strong> Unlimited mock AI interviews
          </span>
        </li>
      </ul>

      <div className="mt-3 flex justify-end">
        <a href="#" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark">
          Apply now
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </a>
      </div>
    </div>
  );
}

const metaIconProps = {
  className: 'h-4 w-4 shrink-0 text-slate-400',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

function KeyIcon() {
  return (
    <svg {...metaIconProps}>
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="M10.5 12.5 19 4M16 7l3 3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg {...metaIconProps}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg {...metaIconProps}>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m16 10 6-3v10l-6-3z" />
    </svg>
  );
}

export default PromotedCard;
