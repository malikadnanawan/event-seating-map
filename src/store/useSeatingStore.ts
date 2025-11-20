import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SeatingState {
  selectedSeats: string[];
  focusedSeatId: string | null;
  toggleSeat: (seatId: string) => void;
  setFocusedSeat: (seatId: string | null) => void;
  clearSelection: () => void;
  canSelectMore: () => boolean;
}

export const useSeatingStore = create<SeatingState>()(
  persist(
    (set, get) => ({
      selectedSeats: [],
      focusedSeatId: null,

      toggleSeat: (seatId: string) => {
        set((state) => {
          const isSelected = state.selectedSeats.includes(seatId);
          
          if (isSelected) {
            return {
              selectedSeats: state.selectedSeats.filter((id) => id !== seatId),
            };
          }
          
          // Max 8 seats
          if (state.selectedSeats.length >= 8) {
            return state;
          }
          
          return {
            selectedSeats: [...state.selectedSeats, seatId],
          };
        });
      },

      setFocusedSeat: (seatId: string | null) => {
        set({ focusedSeatId: seatId });
      },

      clearSelection: () => {
        set({ selectedSeats: [] });
      },

      canSelectMore: () => {
        return get().selectedSeats.length < 8;
      },
    }),
    {
      name: 'seating-storage',
      partialize: (state) => ({ selectedSeats: state.selectedSeats }),
    }
  )
);
