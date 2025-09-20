// utils/pricing.ts

export interface PriceBreakdown {
  basePrice: number;
  displayPrice: number; // Base price + 10%
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number; // 4% of display price
  payAtPropertyFee?: number;
  total: number;
}

export interface PricingConfig {
  displayMarkup: number; // 10% = 0.10
  taxRate: number; // 4% = 0.04
  payAtPropertyFeeRate: number; // 10% = 0.10
  cleaningFee: number;
  serviceFee: number;
}

export const PRICING_CONFIG: PricingConfig = {
  displayMarkup: 0.10, // 10%
  taxRate: 0.04, // 4%
  payAtPropertyFeeRate: 0.10, // 10%
  cleaningFee: 35,
  serviceFee: 4
};

/**
 * Calculate display price (base price + 10% markup)
 */
export const calculateDisplayPrice = (basePrice: number): number => {
  return Math.round(basePrice * (1 + PRICING_CONFIG.displayMarkup));
};

/**
 * Get base price from display price
 */
export const getBasePriceFromDisplay = (displayPrice: number): number => {
  return Math.round(displayPrice / (1 + PRICING_CONFIG.displayMarkup));
};

/**
 * Calculate complete price breakdown for payment
 */
export const calculatePriceBreakdown = (
  basePricePerNight: number, 
  nights: number, 
  isPayAtProperty: boolean = false
): PriceBreakdown => {
  const basePrice = basePricePerNight;
  const displayPrice = calculateDisplayPrice(basePrice);
  const subtotal = displayPrice * nights;
  const cleaningFee = PRICING_CONFIG.cleaningFee;
  const serviceFee = PRICING_CONFIG.serviceFee;
  
  // Calculate 4% tax on the subtotal (display price * nights)
  const taxes = Math.round(subtotal * PRICING_CONFIG.taxRate);
  
  let total = subtotal + cleaningFee + serviceFee + taxes;
  let payAtPropertyFee = 0;
  
  if (isPayAtProperty) {
    payAtPropertyFee = Math.round(total * PRICING_CONFIG.payAtPropertyFeeRate);
    total += payAtPropertyFee;
  }
  
  return {
    basePrice,
    displayPrice,
    subtotal,
    cleaningFee,
    serviceFee,
    taxes,
    payAtPropertyFee: isPayAtProperty ? payAtPropertyFee : undefined,
    total
  };
};

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Calculate total booking price
 */
export const calculateBookingTotal = (
  basePricePerNight: number,
  nights: number,
  isPayAtProperty: boolean = false
): number => {
  const breakdown = calculatePriceBreakdown(basePricePerNight, nights, isPayAtProperty);
  return breakdown.total;
};