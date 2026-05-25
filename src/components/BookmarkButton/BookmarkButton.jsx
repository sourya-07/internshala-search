import PropTypes from 'prop-types';

function BookmarkButton(props) {
  const { isBookmarked, onToggle, className = '' } = props;

  function handleClick(event) {
    // The button lives inside a clickable card, so don't let the click bubble up.
    event.preventDefault();
    event.stopPropagation();
    onToggle();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? 'Remove from saved' : 'Save internship'}
      title={isBookmarked ? 'Remove from saved' : 'Save internship'}
      className={`rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-700 ${
        isBookmarked ? 'text-primary' : ''
      } ${className}`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

BookmarkButton.propTypes = {
  isBookmarked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default BookmarkButton;
