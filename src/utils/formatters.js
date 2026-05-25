// Pure display helpers. No side effects, so they're trivial to unit test.

const SECONDS_TIMESTAMP_CEILING = 1e12; // values below this are seconds, not ms

const TIME_BUCKETS = [
  { limit: 7, unit: 'day' },
  { limit: 5, unit: 'week' },
  { limit: 12, unit: 'month' },
];

const DAYS_PER = { day: 1, week: 7, month: 30, year: 365 };

export function formatStipend(amount) {
  if (!amount || amount <= 0) {
    return 'Unpaid';
  }
  return `₹${amount.toLocaleString('en-IN')}/month`;
}

export function formatDuration(months) {
  if (!months) {
    return '';
  }
  return `${months} Month${months > 1 ? 's' : ''}`;
}

function pluralise(count, unit) {
  return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
}

// Accepts a unix timestamp (seconds or ms) or a date string and returns a
// human phrase like "Posted 3 days ago". Falls back gracefully for old data.
export function getPostedAgo(input) {
  if (input === null || input === undefined || input === '') {
    return '';
  }

  let postedMs;
  if (typeof input === 'number') {
    postedMs = input < SECONDS_TIMESTAMP_CEILING ? input * 1000 : input;
  } else {
    postedMs = Date.parse(input);
  }
  if (Number.isNaN(postedMs)) {
    return '';
  }

  const diffDays = Math.floor((Date.now() - postedMs) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    return 'Posted today';
  }

  let value = diffDays;
  for (const { limit, unit } of TIME_BUCKETS) {
    const scaled = Math.floor(value / DAYS_PER[unit]);
    if (scaled < limit) {
      return `Posted ${pluralise(Math.max(scaled, 1), unit)}`;
    }
  }
  const years = Math.floor(diffDays / DAYS_PER.year);
  return `Posted ${pluralise(Math.max(years, 1), 'year')}`;
}

// First letters of the first two words — used for the logo fallback avatar.
export function getInitials(name) {
  if (!name) {
    return '?';
  }
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
