// Internshala's public listing page (/internships) is server-rendered HTML and,
// unlike the leaner /hiring/search JSON, it carries real skills and stipend
// ranges. We parse that markup into the same tidy model the app already uses.
// The parsing is deliberately defensive: a card that can't yield a title is
// skipped, and the caller falls back to the JSON feed if too little is parsed.

const CARD_DELIMITER = '<div class="container-fluid individual_internship';

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function cleanText(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function matchText(card, regex) {
  const match = card.match(regex);
  return match ? cleanText(match[1]) : '';
}

const META_WINDOW = 150;

// Meta values sit just after an icon (e.g. ic-16-calendar -> "6 Months") and
// are sometimes wrapped in a span. We read a short, bounded window after the
// icon and strip the tags, which keeps unrelated markup out of the value.
function metaByIcon(card, iconClass) {
  const start = card.indexOf(iconClass);
  if (start === -1) {
    return '';
  }
  let rest = card.slice(start);
  rest = rest.slice(rest.indexOf('>') + 1); // skip the rest of the icon's own tag
  const nextIcon = rest.search(/ic-16-/);
  const bound = nextIcon > -1 ? Math.min(nextIcon, META_WINDOW) : META_WINDOW;
  rest = rest.slice(0, bound);
  const lastTag = rest.lastIndexOf('<');
  if (lastTag > -1) {
    rest = rest.slice(0, lastTag); // drop any trailing partial tag
  }
  return cleanText(rest);
}

const POSTED_PATTERN = /(today|few hours ago|\d+\s*(?:hour|day|week|month|year)s?\s*ago)/i;

function parsePostedLabel(card) {
  const start = card.indexOf('ic-16-reschedule');
  const region = start === -1 ? card : card.slice(start, start + 200);
  const match = region.match(POSTED_PATTERN);
  return match ? cleanText(match[0]) : '';
}

function parseStipendValue(stipendText) {
  const digits = stipendText.replace(/,/g, '').match(/\d+/);
  return digits ? Number(digits[0]) : 0;
}

function parseDurationMonths(durationText) {
  const match = /(\d+)/.exec(durationText);
  return match ? Number(match[1]) : 0;
}

function parseCard(card, index) {
  const title =
    matchText(card, /job-internship-name[^>]*>([\s\S]*?)<\/(?:h3|h4|a)>/i) ||
    matchText(card, /class="profile"[^>]*>([\s\S]*?)<\/(?:h3|h4|a|div)>/i);
  if (!title) {
    return null;
  }

  const company = matchText(card, /company_name[^>]*>([\s\S]*?)<\/(?:p|a|div|h\d)>/i);
  const stipendLabel =
    matchText(card, /class=['"][^'"]*\bstipend\b[^'"]*['"][^>]*>([^<]+)/i) ||
    metaByIcon(card, 'ic-16-money');
  const durationLabel = metaByIcon(card, 'ic-16-calendar');
  const locationText =
    matchText(card, /class=['"][^'"]*\blocations\b[^'"]*['"][^>]*>([\s\S]*?)<\/(?:div|a|span)>/i) ||
    metaByIcon(card, 'ic-16-location');
  const postedLabel = parsePostedLabel(card);

  const skills = [...card.matchAll(/job_skill['"][^>]*>([^<]+)</g)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);

  const logoMatch = card.match(/internship_logo[\s\S]*?<img[^>]*\bsrc=["']([^"']+)/i);
  const logo = logoMatch ? logoMatch[1] : '';
  const isRealLogo = logo && !logo.includes('placeholder');

  const hrefMatch = card.match(/\/internship\/detail\/[a-z0-9-]+/i);
  const isWorkFromHome = /work from home/i.test(locationText);

  return {
    id: index + 1,
    title,
    profile: title,
    companyName: company || 'A company',
    companyUrl: null,
    logoUrl: isRealLogo ? `https://internshala.com${logo}` : null,
    isWorkFromHome,
    isPartTime: /part[\s-]?time/i.test(card),
    locations: isWorkFromHome
      ? []
      : locationText.split(',').map((part) => part.trim()).filter(Boolean),
    durationLabel,
    durationMonths: parseDurationMonths(durationLabel),
    stipendLabel,
    stipendValue: parseStipendValue(stipendLabel),
    startDate: '',
    isActivelyHiring: /actively hiring/i.test(card),
    hasJobOffer: /job offer/i.test(card),
    jobOfferLabel: 'Job offer post internship',
    skills,
    postedLabel,
    // "X days ago" / "Today" read as fresh (green); everything else is neutral.
    postedLabelType: /(today|hour|day)/i.test(postedLabel) ? 'success' : 'info',
    postedTimestamp: null,
    applyUrl: hrefMatch ? `https://internshala.com${hrefMatch[0]}` : null,
  };
}

export function parseInternshipsFromHtml(html) {
  const chunks = html.split(CARD_DELIMITER).slice(1);
  return chunks.map((chunk, index) => parseCard(chunk, index)).filter(Boolean);
}
