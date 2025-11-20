import type { SeatWithContext } from '../types/venue';
import { getPriceForTier, formatPrice } from '../utils/pricing';

interface SelectionSummaryProps {
  selectedSeats: SeatWithContext[];
  onClear: () => void;
}

export const SelectionSummary = ({ selectedSeats, onClear }: SelectionSummaryProps) => {
  const subtotal = selectedSeats.reduce((sum, seat) => {
    return sum + getPriceForTier(seat.priceTier);
  }, 0);

  const progressPercent = (selectedSeats.length / 8) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🛒 Your Selection</h3>
        <div style={styles.badge}>{selectedSeats.length}/8</div>
      </div>

      <div style={styles.progressBar}>
        <div style={{...styles.progressFill, width: `${progressPercent}%`}} />
      </div>

      {selectedSeats.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎫</div>
          <p style={styles.empty}>No seats selected yet</p>
          <p style={styles.emptyHint}>Click on available seats to add them</p>
        </div>
      ) : (
        <>
          <div style={styles.list}>
            {selectedSeats.map((seat, idx) => (
              <div key={seat.id} style={styles.seatItem}>
                <div style={styles.seatInfo}>
                  <span style={styles.seatNumber}>{idx + 1}</span>
                  <div>
                    <div style={styles.seatLabel}>
                      {seat.sectionLabel} • Row {seat.rowIndex} • Seat {seat.col}
                    </div>
                    <div style={styles.seatTier}>Tier {seat.priceTier}</div>
                  </div>
                </div>
                <span style={styles.seatPrice}>
                  {formatPrice(getPriceForTier(seat.priceTier))}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.subtotalSection}>
            <div style={styles.subtotalRow}>
              <span style={styles.subtotalLabel}>Subtotal</span>
              <span style={styles.subtotalValue}>{formatPrice(subtotal)}</span>
            </div>
            <div style={styles.subtotalRow}>
              <span style={styles.subtotalLabel}>Fees</span>
              <span style={styles.subtotalValue}>{formatPrice(subtotal * 0.1)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>{formatPrice(subtotal * 1.1)}</span>
            </div>
          </div>

          <button onClick={onClear} style={styles.clearButton}>
            ✕ Clear All
          </button>
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#7c3aed',
  },
  badge: {
    background: '#7c3aed',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 700,
  },
  progressBar: {
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    background: '#7c3aed',
    transition: 'width 0.3s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  empty: {
    color: '#64748b',
    margin: '0 0 8px 0',
    fontSize: '15px',
    fontWeight: 500,
  },
  emptyHint: {
    color: '#94a3b8',
    margin: 0,
    fontSize: '13px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
    maxHeight: '160px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  seatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s',
  },
  seatInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  seatNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    background: '#7c3aed',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: 700,
  },
  seatLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1e293b',
  },
  seatTier: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  seatPrice: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#ec4899',
    minWidth: '60px',
    textAlign: 'right',
  },
  subtotalSection: {
    background: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
  },
  subtotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '13px',
  },
  subtotalLabel: {
    color: '#64748b',
    fontWeight: 500,
  },
  subtotalValue: {
    color: '#1e293b',
    fontWeight: 600,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderTop: '1px solid #e2e8f0',
    marginTop: '8px',
  },
  totalLabel: {
    color: '#1e293b',
    fontWeight: 700,
    fontSize: '14px',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#7c3aed',
  },
  clearButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s',
  },
};
