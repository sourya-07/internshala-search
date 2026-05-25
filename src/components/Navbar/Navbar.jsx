import { useState } from 'react';
import PropTypes from 'prop-types';
import { MessagesSquare } from 'lucide-react';
import logoUrl from '../../assets/internshala-logo.png';

const NAV_LINKS = [
  { label: 'Internships', active: true, caret: true },
  { label: 'Courses', badge: 'OFFER', caret: true },
  { label: 'Jobs', caret: true },
  { label: 'IS PRO' },
];

function NavItem(props) {
  const { label, active, badge, caret, onClick } = props;
  return (
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
      className={`group relative flex h-[72px] items-center text-sm transition-colors hover:text-primary ${
        active ? 'font-medium text-primary' : 'text-[#333333] dark:text-slate-200'
      }`}
    >
      {label}
      {badge && (
        <span className="ml-1.5 rounded bg-[#FF8C00] px-1.5 py-[3px] text-xs font-bold leading-none text-white">
          {badge}
        </span>
      )}
      {caret && <CaretIcon />}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
    </a>
  );
}

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  badge: PropTypes.string,
  caret: PropTypes.bool,
  onClick: PropTypes.func,
};

function Navbar(props) {
  const { savedCount, showSavedOnly, onToggleSaved, onGoToInternships } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleHomeClick(event) {
    event.preventDefault();
    onGoToInternships();
  }

  return (
    <header className="border-b border-[#e8e8e8] bg-white transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <nav className="mx-auto flex h-[72px] max-w-[1224px] items-center justify-between px-4">
        <a
          href="#"
          onClick={handleHomeClick}
          aria-label="Internshala — back to internships"
          className="flex h-[72px] w-[113px] items-start"
        >
          <img
            src={logoUrl}
            alt="Internshala"
            width="113"
            height="31"
            className="mt-[14px] h-[31px] w-[113px] object-contain"
          />
        </a>

        <div className="flex items-center gap-4 lg:gap-7">
          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.label}
                {...link}
                active={link.label === 'Internships' ? !showSavedOnly : link.active}
                onClick={link.label === 'Internships' ? onGoToInternships : undefined}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onToggleSaved}
              aria-pressed={showSavedOnly}
              title="Saved internships"
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                showSavedOnly
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <BookmarkGlyph />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    showSavedOnly ? 'bg-white/25' : 'bg-primary text-white'
                  }`}
                >
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Messages"
              className="hidden rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 sm:block dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <MessagesSquare className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <div className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 sm:flex dark:border-slate-600 dark:text-slate-300">
              <UserIcon />
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-slate-200 px-4 py-2 lg:hidden dark:border-slate-700">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (link.label === 'Internships') {
                  onGoToInternships();
                }
                setIsMenuOpen(false);
              }}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

Navbar.propTypes = {
  savedCount: PropTypes.number.isRequired,
  showSavedOnly: PropTypes.bool.isRequired,
  onToggleSaved: PropTypes.func.isRequired,
  onGoToInternships: PropTypes.func.isRequired,
};

// Filled caret that points down by default and rotates up on hover (matches
// Internshala's dropdown-open indicator).
function CaretIcon() {
  return (
    <svg
      className="ml-1.5 h-2 w-2 transition-transform duration-200 group-hover:-rotate-180"
      viewBox="0 0 10 6"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 0h10L5 6z" />
    </svg>
  );
}

function BookmarkGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MenuIcon(props) {
  const { isOpen } = props;
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {isOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
    </svg>
  );
}

MenuIcon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Navbar;
