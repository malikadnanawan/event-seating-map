import { useState, useEffect, useMemo } from 'react';
import type { VenueData, SeatWithContext } from '../types/venue';

export const useVenueData = () => {
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/venue.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load venue data');
        return res.json();
      })
      .then((data: VenueData) => {
        setVenue(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { venue, loading, error };
};

export const useSeatLookup = (venue: VenueData | null) => {
  const seatMap = useMemo(() => {
    if (!venue) return new Map<string, SeatWithContext>();

    const map = new Map<string, SeatWithContext>();
    
    venue.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          map.set(seat.id, {
            ...seat,
            sectionId: section.id,
            sectionLabel: section.label,
            rowIndex: row.index,
          });
        });
      });
    });

    return map;
  }, [venue]);

  return seatMap;
};
