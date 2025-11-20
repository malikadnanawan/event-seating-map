import { memo } from 'react';
import type { Seat as SeatType } from '../types/venue';

interface SeatProps {
  seat: SeatType;
  sectionLabel: string;
  rowIndex: number;
  isSelected: boolean;
  isFocused: boolean;
  onClick: () => void;
  onFocus: () => void;
}

const CHAIR_WIDTH = 38;
const CHAIR_HEIGHT = 44;

const getSeatColor = (status: SeatType['status'], isSelected: boolean): string => {
  if (isSelected) return '#ec4899';
  
  switch (status) {
    case 'available':
      return '#7c3aed';
    case 'reserved':
      return '#f59e0b';
    case 'sold':
      return '#ef4444';
    case 'held':
      return '#8b5cf6';
    default:
      return '#7c3aed';
  }
};

const canInteract = (status: SeatType['status']): boolean => {
  return status === 'available';
};

const SofaIcon = ({ x, y, color, isSelected, isFocused }: { x: number; y: number; color: string; isSelected: boolean; isFocused: boolean }) => {
  const sofaX = x - CHAIR_WIDTH / 2;
  const sofaY = y - CHAIR_HEIGHT / 2;
  
  // Color variations for depth
  const darkerColor = isSelected ? '#be185d' : 
    color === '#7c3aed' ? '#5b21b6' :
    color === '#f59e0b' ? '#d97706' :
    color === '#ef4444' ? '#dc2626' :
    color === '#8b5cf6' ? '#7c3aed' : color;
    
  const darkestColor = isSelected ? '#9f1239' : 
    color === '#7c3aed' ? '#4c1d95' :
    color === '#f59e0b' ? '#b45309' :
    color === '#ef4444' ? '#b91c1c' :
    color === '#8b5cf6' ? '#6d28d9' : color;

  const gradientId = `sofa-gradient-${x}-${y}`;
  const armrestGradientId = `armrest-gradient-${x}-${y}`;

  return (
    <g>
      {/* Define gradients for 3D effect */}
      <defs>
        {/* Main cushion gradient */}
        <radialGradient id={gradientId} cx="30%" cy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </radialGradient>
        
        {/* Armrest gradient */}
        <linearGradient id={armrestGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darkerColor} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={darkerColor} />
        </linearGradient>
      </defs>

      {/* Outer glow for selected */}
      {isSelected && (
        <circle
          cx={x}
          cy={y}
          r={30}
          fill={color}
          opacity="0.15"
          style={{
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Focus ring */}
      {isFocused && (
        <circle
          cx={x}
          cy={y}
          r={27}
          fill="none"
          stroke="#e0e7ff"
          strokeWidth={2}
          strokeDasharray="3,3"
          style={{
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Shadow under sofa for ground contact */}
      <ellipse
        cx={x}
        cy={sofaY + 38}
        rx={16}
        ry={3}
        fill="black"
        opacity={0.2}
      />

      {/* Left armrest base - darker for depth */}
      <ellipse
        cx={sofaX + 5}
        cy={sofaY + 18}
        rx={6}
        ry={13}
        fill={darkestColor}
        opacity={0.6}
      />
      
      {/* Left armrest - rounded cushion shape with gradient */}
      <ellipse
        cx={sofaX + 5}
        cy={sofaY + 17}
        rx={5.5}
        ry={12}
        fill={`url(#${armrestGradientId})`}
        style={{
          opacity: isSelected ? 1 : 0.95,
        }}
      />
      
      {/* Left armrest highlight */}
      <ellipse
        cx={sofaX + 4}
        cy={sofaY + 14}
        rx={2}
        ry={5}
        fill="white"
        opacity={0.4}
      />

      {/* Right armrest base - darker for depth */}
      <ellipse
        cx={sofaX + CHAIR_WIDTH - 5}
        cy={sofaY + 18}
        rx={6}
        ry={13}
        fill={darkestColor}
        opacity={0.6}
      />
      
      {/* Right armrest - rounded cushion shape with gradient */}
      <ellipse
        cx={sofaX + CHAIR_WIDTH - 5}
        cy={sofaY + 17}
        rx={5.5}
        ry={12}
        fill={`url(#${armrestGradientId})`}
        style={{
          opacity: isSelected ? 1 : 0.95,
        }}
      />
      
      {/* Right armrest highlight */}
      <ellipse
        cx={sofaX + CHAIR_WIDTH - 6}
        cy={sofaY + 14}
        rx={2}
        ry={5}
        fill="white"
        opacity={0.4}
      />

      {/* Backrest shadow layer */}
      <ellipse
        cx={x}
        cy={sofaY + 10}
        rx={13}
        ry={7}
        fill={darkestColor}
        opacity={0.5}
      />

      {/* Backrest - curved cushioned back */}
      <path
        d={`
          M ${sofaX + 8} ${sofaY + 6}
          Q ${x} ${sofaY + 2} ${sofaX + CHAIR_WIDTH - 8} ${sofaY + 6}
          Q ${x} ${sofaY + 11} ${sofaX + 8} ${sofaY + 6}
        `}
        fill={`url(#${gradientId})`}
        style={{
          opacity: isSelected ? 1 : 0.95,
        }}
      />
      
      {/* Backrest cushion detail with gradient */}
      <ellipse
        cx={x}
        cy={sofaY + 8}
        rx={12}
        ry={6}
        fill={`url(#${gradientId})`}
        style={{
          opacity: isSelected ? 1 : 0.9,
        }}
      />
      
      {/* Backrest inner shadow for depth */}
      <ellipse
        cx={x}
        cy={sofaY + 9}
        rx={10}
        ry={4}
        fill={darkerColor}
        opacity={0.3}
      />

      {/* Main seat cushion base shadow */}
      <ellipse
        cx={x}
        cy={sofaY + 24}
        rx={15}
        ry={11}
        fill={darkestColor}
        opacity={0.5}
      />

      {/* Main seat cushion - rounded front with gradient */}
      <ellipse
        cx={x}
        cy={sofaY + 22}
        rx={14}
        ry={10}
        fill={`url(#${gradientId})`}
        style={{
          opacity: isSelected ? 1 : 0.98,
        }}
      />
      
      {/* Seat cushion center depression for realism */}
      <ellipse
        cx={x}
        cy={sofaY + 23}
        rx={10}
        ry={7}
        fill={darkerColor}
        opacity={0.25}
      />

      {/* Left seat cushion detail with depth */}
      <ellipse
        cx={x - 6}
        cy={sofaY + 22}
        rx={6}
        ry={8}
        fill={`url(#${gradientId})`}
        opacity={0.85}
      />
      
      {/* Left cushion shadow */}
      <ellipse
        cx={x - 6}
        cy={sofaY + 23}
        rx={4}
        ry={6}
        fill={darkerColor}
        opacity={0.3}
      />
      
      {/* Right seat cushion detail with depth */}
      <ellipse
        cx={x + 6}
        cy={sofaY + 22}
        rx={6}
        ry={8}
        fill={`url(#${gradientId})`}
        opacity={0.85}
      />
      
      {/* Right cushion shadow */}
      <ellipse
        cx={x + 6}
        cy={sofaY + 23}
        rx={4}
        ry={6}
        fill={darkerColor}
        opacity={0.3}
      />

      {/* Sofa base - curved bottom with depth */}
      <ellipse
        cx={x}
        cy={sofaY + 34}
        rx={14}
        ry={5}
        fill={darkestColor}
        style={{
          opacity: isSelected ? 0.9 : 0.7,
        }}
      />
      
      {/* Base highlight */}
      <ellipse
        cx={x}
        cy={sofaY + 33}
        rx={13}
        ry={3}
        fill={darkerColor}
        opacity={0.8}
      />

      {/* Multiple highlight layers for realistic shine */}
      <ellipse
        cx={x - 5}
        cy={sofaY + 6}
        rx={6}
        ry={3}
        fill="white"
        opacity={isSelected ? 0.6 : 0.45}
        style={{
          pointerEvents: 'none',
        }}
      />
      
      <ellipse
        cx={x - 4}
        cy={sofaY + 19}
        rx={5}
        ry={3}
        fill="white"
        opacity={isSelected ? 0.5 : 0.35}
        style={{
          pointerEvents: 'none',
        }}
      />
      
      {/* Smaller accent highlights */}
      <ellipse
        cx={x + 3}
        cy={sofaY + 7}
        rx={3}
        ry={2}
        fill="white"
        opacity={0.3}
        style={{
          pointerEvents: 'none',
        }}
      />
      
      <ellipse
        cx={x + 2}
        cy={sofaY + 20}
        rx={2}
        ry={1.5}
        fill="white"
        opacity={0.25}
        style={{
          pointerEvents: 'none',
        }}
      />

      {/* Checkmark for selected seats */}
      {isSelected && (
        <g
          style={{
            pointerEvents: 'none',
          }}
        >
          <path
            d={`M ${x - 5} ${y - 2} L ${x - 2} ${y + 2} L ${x + 6} ${y - 6}`}
            stroke="white"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
};

export const Seat = memo(({
  seat,
  sectionLabel,
  rowIndex,
  isSelected,
  isFocused,
  onClick,
  onFocus,
}: SeatProps) => {
  const interactive = canInteract(seat.status);
  const color = getSeatColor(seat.status, isSelected);
  const x = seat.x;
  const y = seat.y;
  
  const ariaLabel = `Section ${sectionLabel}, Row ${rowIndex}, Seat ${seat.col}, Price tier ${seat.priceTier}, ${seat.status}${isSelected ? ', selected' : ''}`;

  const handleClick = () => {
    if (interactive) {
      onFocus(); // Show details when clicked
      onClick(); // Handle selection
    }
  };

  return (
    <g
      onClick={handleClick}
      onFocus={onFocus}
      role="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      aria-disabled={!interactive}
      tabIndex={interactive ? 0 : -1}
      style={{
        cursor: interactive ? 'pointer' : 'not-allowed',
        filter: isSelected 
          ? `drop-shadow(0 4px 12px ${color}60) drop-shadow(0 0 8px ${color}40)`
          : isFocused
          ? 'drop-shadow(0 0 6px rgba(255,255,255,0.5))'
          : 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: interactive ? 1 : 0.35,
      } as React.CSSProperties}
    >
      <SofaIcon x={x} y={y} color={color} isSelected={isSelected} isFocused={isFocused} />
    </g>
  );
});

Seat.displayName = 'Seat';
