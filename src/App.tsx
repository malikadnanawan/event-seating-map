import { useMemo, useState } from "react";
import { useVenueData, useSeatLookup } from "./hooks/useVenueData";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useSeatingStore } from "./store/useSeatingStore";
import { SeatingMap } from "./components/SeatingMap";
import { SeatDetails } from "./components/SeatDetails";
import { SelectionSummary } from "./components/SelectionSummary";
import { Modal } from "./components/Modal";

// Add responsive styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @media (max-width: 1024px) {
      [data-layout] {
        flex-wrap: wrap !important;
      }
      [data-main] {
        flex: 1 1 100% !important;
        min-height: 600px !important;
      }
      [data-sidebar] {
        flex: 1 1 100% !important;
        max-height: none !important;
      }
    }
    
    @media (max-width: 768px) {
      [data-header] {
        padding: 16px !important;
      }
      [data-legend] {
        gap: 12px !important;
        padding: 12px 16px !important;
      }
      [data-legend-item] {
        font-size: 12px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

function App() {
  const { venue, loading, error } = useVenueData();
  const seatMap = useSeatLookup(venue);
  const [zoom, setZoom] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const {
    selectedSeats,
    focusedSeatId,
    toggleSeat,
    setFocusedSeat,
    clearSelection,
    canSelectMore,
  } = useSeatingStore();

  const handleSeatClick = (seatId: string) => {
    const seat = seatMap.get(seatId);
    if (!seat || seat.status !== "available") return;

    if (!selectedSeats.includes(seatId) && !canSelectMore()) {
      setShowModal(true);
      return;
    }

    toggleSeat(seatId);
  };

  const handleSeatFocus = (seatId: string) => {
    setFocusedSeat(seatId);
  };

  useKeyboardNavigation({
    venue,
    focusedSeatId,
    onFocusChange: setFocusedSeat,
    onSelect: handleSeatClick,
  });

  const focusedSeat = focusedSeatId ? seatMap.get(focusedSeatId) || null : null;

  const selectedSeatDetails = useMemo(() => {
    return selectedSeats
      .map((id) => seatMap.get(id))
      .filter((seat): seat is NonNullable<typeof seat> => seat !== undefined);
  }, [selectedSeats, seatMap]);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading venue data...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div style={styles.center}>
        <div style={styles.errorContainer}>
          <p style={styles.error}>⚠️ {error || "Failed to load venue"}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Selection Limit Reached"
        message="You have already selected the maximum of 8 seats. Please deselect a seat before selecting another one."
      />
      
      <header style={styles.header} data-header>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>🎭 {venue.name}</h1>
            <p style={styles.subtitle}>
              Select up to 8 seats • {selectedSeats.length}/8 selected
            </p>
          </div>
          <div style={styles.zoomControls}>
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              style={styles.zoomButton}
              title="Zoom out"
            >
              −
            </button>
            <span style={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.2))}
              style={styles.zoomButton}
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoom(1)}
              style={styles.zoomButton}
              title="Reset zoom"
            >
              ⟲
            </button>
          </div>
        </div>
      </header>

      <div style={styles.layout} data-layout>
        <main style={styles.main} data-main>
          <div style={styles.mapWrapper}>
            <div
              style={{ ...styles.mapContainer, transform: `scale(${zoom})` }}
            >
              <SeatingMap
                venue={venue}
                onSeatClick={handleSeatClick}
                onSeatFocus={handleSeatFocus}
              />
            </div>
            <div style={styles.legend} data-legend>
              <div style={styles.legendItem} data-legend-item>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#7c3aed" }}
                />
                <span>Available</span>
              </div>
              <div style={styles.legendItem} data-legend-item>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#ec4899" }}
                />
                <span>Selected</span>
              </div>
              <div style={styles.legendItem} data-legend-item>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#f59e0b" }}
                />
                <span>Reserved</span>
              </div>
              <div style={styles.legendItem} data-legend-item>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#ef4444" }}
                />
                <span>Sold</span>
              </div>
              <div style={styles.legendItem} data-legend-item>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#8b5cf6" }}
                />
                <span>Held</span>
              </div>
            </div>
          </div>
        </main>

        <aside style={styles.sidebar} data-sidebar>
          <SeatDetails seat={focusedSeat} />
          <SelectionSummary
            selectedSeats={selectedSeatDetails}
            onClear={clearSelection}
          />
        </aside>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "#ffffff",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  loadingContainer: {
    textAlign: "center",
    color: "#fff",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    fontSize: "18px",
    margin: 0,
  },
  errorContainer: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  error: {
    color: "#f44336",
    fontSize: "18px",
    margin: 0,
  },
  header: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(0,0,0,0.06)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "32px",
    fontWeight: 700,
    color: "#7c3aed",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 500,
  },
  zoomControls: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  zoomButton: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    color: "#475569",
    transition: "all 0.2s",
  } as React.CSSProperties,
  zoomLevel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#475569",
    minWidth: "50px",
    textAlign: "center",
  },
  layout: {
    display: "flex",
    gap: "20px",
    maxWidth: "100%",
    margin: "0 auto",
    flexWrap: "wrap",
  } as React.CSSProperties,
  main: {
    flex: "1 1 auto",
    minWidth: "0",
    display: "flex",
    flexDirection: "column",
    height: "auto",
  },
  mapWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "12px",
    height: "auto",
  },
  mapContainer: {
    background: "transparent",
    borderRadius: "0",
    padding: "0",
    boxShadow: "none",
    transformOrigin: "top center",
    transition: "transform 0.3s ease",
    overflow: "visible",
    height: "auto",
    minHeight: "auto",
  },
  sidebar: {
    flex: "0 0 360px",
    minWidth: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: "900px",
    overflowY: "auto",
  } as React.CSSProperties,
  footer: {
    display: "none",
  },
  legend: {
    display: "flex",
    gap: "20px",
    padding: "14px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    flexWrap: "wrap",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    backdropFilter: "blur(10px)",
    width: "100%",
    flexShrink: 0,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
    whiteSpace: "nowrap",
  },
  legendColor: {
    width: "14px",
    height: "14px",
    borderRadius: "3px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};

export default App;
