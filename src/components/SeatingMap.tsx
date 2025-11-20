import { useMemo } from "react";
import type { VenueData } from "../types/venue";
import { Seat } from "./Seat";
import { useSeatingStore } from "../store/useSeatingStore";

interface SeatingMapProps {
  venue: VenueData;
  onSeatClick: (seatId: string) => void;
  onSeatFocus: (seatId: string) => void;
}

export const SeatingMap = ({
  venue,
  onSeatClick,
  onSeatFocus,
}: SeatingMapProps) => {
  const { selectedSeats, focusedSeatId } = useSeatingStore();

  const allSeats = useMemo(() => {
    const seats: Array<{
      seat: VenueData["sections"][0]["rows"][0]["seats"][0];
      sectionLabel: string;
      sectionId: string;
      rowIndex: number;
    }> = [];

    venue.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          seats.push({
            seat,
            sectionLabel: section.label,
            sectionId: section.id,
            rowIndex: row.index,
          });
        });
      });
    });

    return seats;
  }, [venue]);

  const rowLabels = useMemo(() => {
    const labels: Record<number, { minX: number; y: number }> = {};

    allSeats.forEach(({ seat, rowIndex }) => {
      if (!labels[rowIndex]) {
        labels[rowIndex] = { minX: seat.x, y: seat.y };
      } else {
        labels[rowIndex].minX = Math.min(labels[rowIndex].minX, seat.x);
      }
    });

    return labels;
  }, [allSeats]);

  return (
    <div style={styles.container}>
      <div style={styles.stageContainer}>
        <div style={styles.stage}>
          <span style={styles.stageText}>🎬 STAGE</span>
        </div>
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
        style={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Row labels on the left */}
        {Object.entries(rowLabels).map(([rowIndex, { minX, y }]) => (
          <text
            key={`row-label-${rowIndex}`}
            x={minX - 50}
            y={y + 10}
            textAnchor="end"
            fill="#cbd5e1"
            fontSize="32"
            fontWeight="700"
            style={{ pointerEvents: "none" }}
          >
            Row {rowIndex}
          </text>
        ))}

        {/* Seats */}
        {allSeats.map(({ seat, sectionLabel, rowIndex }) => (
          <Seat
            key={seat.id}
            seat={seat}
            sectionLabel={sectionLabel}
            rowIndex={rowIndex}
            isSelected={selectedSeats.includes(seat.id)}
            isFocused={focusedSeatId === seat.id}
            onClick={() => onSeatClick(seat.id)}
            onFocus={() => onSeatFocus(seat.id)}
          />
        ))}
      </svg>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    height: "600px",
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: "#0f172a",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  stageContainer: {
    padding: "24px 0 16px 0",
    textAlign: "center",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.4) 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  stage: {
    display: "inline-block",
    padding: "12px 48px",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    border: "2px solid rgba(148,163,184,0.3)",
    borderRadius: "8px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  stageText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#cbd5e1",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  svg: {
    display: "block",
    flex: 1,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% 50%, rgba(51,65,85,0.1) 0%, rgba(15,23,42,0) 70%)",
  },
};
