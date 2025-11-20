import { useEffect, useCallback } from 'react';
import type { VenueData } from '../types/venue';

interface UseKeyboardNavigationProps {
  venue: VenueData | null;
  focusedSeatId: string | null;
  onFocusChange: (seatId: string) => void;
  onSelect: (seatId: string) => void;
}

export const useKeyboardNavigation = ({
  venue,
  focusedSeatId,
  onFocusChange,
  onSelect,
}: UseKeyboardNavigationProps) => {
  const getAllSeatIds = useCallback((): string[] => {
    if (!venue) return [];
    
    const ids: string[] = [];
    venue.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          ids.push(seat.id);
        });
      });
    });
    return ids;
  }, [venue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedSeatId) return;

      const allSeats = getAllSeatIds();
      const currentIndex = allSeats.indexOf(focusedSeatId);
      
      if (currentIndex === -1) return;

      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(currentIndex + 1, allSeats.length - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = Math.min(currentIndex + 5, allSeats.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = Math.max(currentIndex - 5, 0);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect(focusedSeatId);
          return;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        onFocusChange(allSeats[newIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedSeatId, getAllSeatIds, onFocusChange, onSelect]);
};
