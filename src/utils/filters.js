// Pure filter functions. Each takes the (normalised) internship list plus a
// criterion and returns a new filtered list — no mutation, easy to test.
// An empty/falsy criterion is treated as "no constraint" and passes everything
// through, which keeps `applyAllFilters` a clean left-to-right composition.

export function filterByProfile(internships, profiles) {
  if (!profiles.length) {
    return internships;
  }
  const wanted = new Set(profiles);
  return internships.filter((internship) => wanted.has(internship.profile));
}

export function filterByLocation(internships, locations) {
  if (!locations.length) {
    return internships;
  }
  const wanted = new Set(locations.map((location) => location.toLowerCase()));
  return internships.filter((internship) =>
    internship.locations.some((location) => wanted.has(location.toLowerCase())),
  );
}

export function filterByWorkFromHome(internships, workFromHomeOnly) {
  if (!workFromHomeOnly) {
    return internships;
  }
  return internships.filter((internship) => internship.isWorkFromHome);
}

export function filterByPartTime(internships, partTimeOnly) {
  if (!partTimeOnly) {
    return internships;
  }
  return internships.filter((internship) => internship.isPartTime);
}

export function filterByMaxDuration(internships, maxDuration) {
  if (!maxDuration) {
    return internships;
  }
  return internships.filter(
    (internship) => internship.durationMonths > 0 && internship.durationMonths <= maxDuration,
  );
}

export function filterByJobOffer(internships, hasJobOffer) {
  if (!hasJobOffer) {
    return internships;
  }
  return internships.filter((internship) => internship.hasJobOffer);
}

export function filterByStipend(internships, minStipend) {
  if (!minStipend) {
    return internships;
  }
  return internships.filter((internship) => internship.stipendValue >= minStipend);
}

// The API has no skills field, so keyword search spans role, company and city.
export function filterByKeyword(internships, keyword) {
  const query = keyword.trim().toLowerCase();
  if (!query) {
    return internships;
  }
  return internships.filter((internship) => {
    const haystack = [
      internship.title,
      internship.profile,
      internship.companyName,
      ...internship.locations,
      ...(internship.skills || []),
    ];
    return haystack.some((field) => field.toLowerCase().includes(query));
  });
}

export function applyAllFilters(internships, filters) {
  let result = internships;
  result = filterByKeyword(result, filters.keyword);
  result = filterByProfile(result, filters.profiles);
  result = filterByWorkFromHome(result, filters.workFromHome);
  result = filterByPartTime(result, filters.partTime);
  result = filterByLocation(result, filters.locations);
  result = filterByMaxDuration(result, filters.maxDuration);
  result = filterByJobOffer(result, filters.hasJobOffer);
  result = filterByStipend(result, filters.minStipend);
  return result;
}
