const PRICE_TIERS: Record<number, number> = {
  1: 50,
  2: 75,
  3: 100,
  4: 150,
};

export const getPriceForTier = (tier: number): number => {
  return PRICE_TIERS[tier] || 50;
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
