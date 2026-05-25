import { useEffect, useState } from 'react';
import { API_ENDPOINT, LISTING_ENDPOINT, LOGO_BASE_URL } from '../constants/filterOptions';
import { parseInternshipsFromHtml } from '../utils/parseInternships';
import fallbackInternships from '../data/internships.fallback.json';

const MIN_PARSED_RESULTS = 3;

function parseDurationMonths(durationLabel) {
  const match = /(\d+)/.exec(durationLabel || '');
  return match ? Number(match[1]) : 0;
}

// Maps the leaner /hiring/search JSON record into our model. Used as a fallback
// when the richer listing page can't be parsed.
function normalizeJsonInternship(raw) {
  const stipend = raw.stipend || {};
  return {
    id: raw.id,
    title: raw.title || raw.profile_name || 'Internship',
    profile: raw.profile_name || raw.title || '',
    companyName: raw.company_name || 'A company',
    companyUrl: raw.company_url ? `https://internshala.com${raw.company_url}` : null,
    logoUrl: raw.company_logo ? `${LOGO_BASE_URL}${raw.company_logo}` : null,
    isWorkFromHome: Boolean(raw.work_from_home),
    isPartTime: Boolean(raw.part_time),
    locations: Array.isArray(raw.location_names) ? raw.location_names.filter(Boolean) : [],
    durationLabel: raw.duration || '',
    durationMonths: parseDurationMonths(raw.duration),
    stipendLabel: (stipend.salary || '').replace(/\s+/g, ' ').trim(),
    stipendValue: stipend.salaryValue1 ?? 0,
    startDate: raw.start_date || '',
    isActivelyHiring: Boolean(raw.is_active),
    hasJobOffer: Boolean(raw.is_ppo),
    jobOfferLabel: raw.ppo_label_value || 'Job offer post internship',
    skills: [],
    postedLabel: raw.posted_by_label || '',
    postedLabelType: raw.posted_by_label_type || '',
    postedTimestamp: raw.postedOnDateTime ? raw.postedOnDateTime * 1000 : null,
    applyUrl: raw.url ? `https://internshala.com/internship/detail/${raw.url}` : null,
  };
}

async function fetchFromJsonFeed(signal) {
  const response = await fetch(API_ENDPOINT, { headers: { Accept: 'application/json' }, signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const payload = await response.json();
  const meta = payload.internships_meta || {};
  const order = Array.isArray(payload.internship_ids) ? payload.internship_ids : [];
  const ranked = order.length ? order.map((id) => meta[id]).filter(Boolean) : Object.values(meta);
  return ranked.map(normalizeJsonInternship);
}

// Fetches the internship list once on mount. All filtering happens downstream on
// this in-memory list, so there are no further network calls. Source priority:
//   1. live listing page (richest — skills, stipend ranges)
//   2. live /hiring/search JSON feed
//   3. bundled real-data snapshot — used when the live endpoints are unreachable
//      or blocked (Internshala blocks datacenter IPs, e.g. on Vercel), so the
//      deployed app always shows real data.
export function useInternships() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInternships() {
      let results = [];

      try {
        const response = await fetch(LISTING_ENDPOINT, { signal: controller.signal });
        if (response.ok) {
          results = parseInternshipsFromHtml(await response.text());
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
      }

      if (results.length < MIN_PARSED_RESULTS) {
        try {
          results = await fetchFromJsonFeed(controller.signal);
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      // Live endpoints blocked/unreachable → serve the cached real snapshot.
      if (results.length === 0) {
        results = fallbackInternships;
      }

      if (!controller.signal.aborted) {
        if (results.length === 0) {
          setError('Unable to load internships right now.');
        } else {
          setInternships(results);
        }
        setIsLoading(false);
      }
    }

    loadInternships();
    return () => controller.abort();
  }, []);

  return { internships, isLoading, error };
}
