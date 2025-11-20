# Interactive Event Seating Map

A React + TypeScript application for rendering and interacting with event venue seating maps. Built with performance, accessibility, and user experience in mind.

## Features

- **Interactive Seating Map**: Click or keyboard-navigate to select seats
- **Seat Selection**: Select up to 8 seats with visual feedback
- **Real-time Details**: View seat information (section, row, price, status) on focus/click
- **Live Summary**: See selected seats and running subtotal
- **Persistent State**: Selected seats saved to localStorage
- **Accessibility**: Full keyboard navigation, ARIA labels, focus management
- **Responsive**: Works on desktop and mobile devices

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Architecture

### Rendering Approach: SVG

**Why SVG over Canvas:**
- Native DOM events (click, focus, hover) without manual hit detection
- Built-in accessibility support (ARIA attributes, keyboard focus)
- Easier to style and animate individual seats
- Browser handles rendering optimization
- Simpler React integration with component-per-seat model

**Trade-off:** For 15k+ seats, Canvas would be faster for raw rendering, but we'd lose accessibility and need custom event handling. For this use case, SVG with viewport culling (future optimization) is the better choice.

### State Management: Zustand

**Why Zustand:**
- Minimal boilerplate compared to Redux
- Built-in localStorage persistence middleware
- TypeScript-friendly with full type inference
- Small bundle size (~1KB)
- Simple API for this use case

**What's in the store:**
- `selectedSeats`: Array of seat IDs (max 8)
- `focusedSeatId`: Currently focused seat for keyboard navigation
- `toggleSeat()`: Add/remove seat from selection
- `setFocusedSeat()`: Update keyboard focus
- `clearSelection()`: Reset all selections

### Component Structure

```
App.tsx                    # Main container, orchestrates data flow
├── SeatingMap.tsx         # SVG container, renders all seats
│   └── Seat.tsx          # Individual seat with interactions
├── SeatDetails.tsx        # Shows focused seat information
└── SelectionSummary.tsx   # Lists selected seats + subtotal
```

### Key Design Decisions

1. **Seat coordinates are absolute** - No layout calculation needed, just render at (x, y)
2. **Memoization** - `React.memo` on Seat component prevents unnecessary re-renders
3. **Lookup Map** - `useSeatLookup` creates a Map for O(1) seat detail retrieval
4. **Keyboard Navigation** - Arrow keys move focus, Enter/Space selects
5. **Status-based Interaction** - Only "available" seats are clickable/selectable

## File Structure

```
src/
├── components/
│   ├── SeatingMap.tsx      # Main SVG map container
│   ├── Seat.tsx            # Individual seat component
│   ├── SeatDetails.tsx     # Seat info panel
│   └── SelectionSummary.tsx # Selection list + subtotal
├── hooks/
│   ├── useVenueData.ts     # Fetch and parse venue.json
│   └── useKeyboardNavigation.ts # Arrow key navigation
├── store/
│   └── useSeatingStore.ts  # Zustand store with localStorage
├── types/
│   └── venue.ts            # TypeScript interfaces
├── utils/
│   └── pricing.ts          # Price tier calculations
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Global styles + a11y focus
```

## Accessibility Features

- **ARIA Labels**: Each seat announces section, row, seat number, price, and status
- **Keyboard Navigation**: 
  - Arrow keys to move between seats
  - Enter/Space to select
  - Tab to cycle through interactive elements
- **Focus Indicators**: Visual outline on focused seats
- **Semantic Roles**: Seats use `role="button"` with `aria-pressed` state
- **Status Announcements**: Screen readers announce seat availability

## Data Format

Venue data is loaded from `public/venue.json`:

```json
{
  "venueId": "arena-01",
  "name": "Metropolis Arena",
  "map": { "width": 1024, "height": 768 },
  "sections": [
    {
      "id": "A",
      "label": "Lower Bowl A",
      "transform": { "x": 0, "y": 0, "scale": 1 },
      "rows": [
        {
          "index": 1,
          "seats": [
            {
              "id": "A-1-01",
              "col": 1,
              "x": 50,
              "y": 40,
              "priceTier": 1,
              "status": "available"
            }
          ]
        }
      ]
    }
  ]
}
```

**Seat Status Values:**
- `available` - Can be selected
- `reserved` - Held by another user
- `sold` - Already purchased
- `held` - Temporarily locked

## Performance Considerations

**Current Implementation:**
- All seats render on mount (fine for <1000 seats)
- `React.memo` prevents unnecessary seat re-renders
- `useMemo` for derived state (selected seat details)



