import type { SeatWithContext } from '../types/venue';
import { getPriceForTier, formatPrice } from '../utils/pricing';

interface SeatDetailsProps {
  seat: SeatWithContext | null;
}

export const SeatDetails = ({ seat }: SeatDetailsProps) => {
  if (!seat) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🪑</div>
          <p style={styles.placeholder}>Click or focus on a seat to see details</p>
        </div>
      </div>
    );
  }

  const price = getPriceForTier(seat.priceTier);
  const statusEmoji = {
    available: '✅',
    reserved: '🔒',
    sold: '❌',
    held: '⏳',
  }[seat.status];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎫 Seat Details</h3>
      <div style={styles.details}>
        <div style={styles.row}>
          <span style={styles.label}>Section</span>
          <span style={styles.value}>{seat.sectionLabel}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.row}>
          <span style={styles.label}>Row</span>
          <span style={styles.value}>{seat.rowIndex}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.row}>
          <span style={styles.label}>Seat</span>
          <span style={styles.value}>{seat.col}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.row}>
          <span style={styles.label}>Price</span>
          <span style={{...styles.value, ...styles.priceValue}}>{formatPrice(price)}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.row}>
          <span style={styles.label}>Status</span>
          <span style={{...styles.value, ...styles.statusBadge, ...styles[seat.status]}}>
            {statusEmoji} {seat.status}
          </span>
        </div>
      </div>
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
  emptyState: {
    textAlign: 'center',
    padding: '20px 0',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  placeholder: {
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: 0,
    fontSize: '14px',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    fontWeight: 700,
    color: '#7c3aed',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
  },
  divider: {
    height: '1px',
    background: '#e2e8f0',
  },
  label: {
    fontWeight: 600,
    color: '#64748b',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  value: {
    color: '#1e293b',
    fontWeight: 600,
    fontSize: '15px',
  },
  priceValue: {
    color: '#ec4899',
    fontSize: '18px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 600,
  },
  available: {
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
  },
  reserved: {
    backgroundColor: '#fef3c7',
    color: '#f59e0b',
  },
  sold: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  held: {
    backgroundColor: '#f3e8ff',
    color: '#8b5cf6',
  },
};
