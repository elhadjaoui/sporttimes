import { useEffect, useState } from 'react';

const BASELINE_YEAR = 2026;

// Set after mount so a page prerendered in an earlier year neither
// mismatches on hydration nor shows a stale year.
export function useCurrentYear() {
  const [year, setYear] = useState(BASELINE_YEAR);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return year;
}
