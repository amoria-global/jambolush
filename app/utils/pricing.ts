// utils/pricing.ts

export interface PriceBreakdown {
  price: number; // Display price shown to customer
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number; // 4% of display price
  payAtPropertyFee?: number;
  total: number;
}

export interface PricingConfig {
  displayMarkup: number; // 10% markup (hidden from customer)
  taxRate: number; // 4% tax (visible to customer)
  payAtPropertyFeeRate: number; // 10%
  cleaningFee: number;
  serviceFee: number;
}

export const PRICING_CONFIG: PricingConfig = {
  displayMarkup: 0.10, // 10% hidden markup
  taxRate: 0.04, // 4% visible tax
  payAtPropertyFeeRate: 0.10, // 10%
  cleaningFee: 0, // No cleaning fee for tours
  serviceFee: 0 // No service fee - taxes only
};

/**
 * Calculate display price from original price (adds 10% markup)
 * This price is shown to customer (markup is hidden)
 */
export const calculateDisplayPrice = (originalPrice: number): number => {
  return Math.round(originalPrice * (1 + PRICING_CONFIG.displayMarkup));
};

/**
 * Get original price from display price
 */
export const getOriginalPrice = (displayPrice: number): number => {
  return Math.round(displayPrice / (1 + PRICING_CONFIG.displayMarkup));
};

/**
 * Calculate complete price breakdown for payment
 * Customer sees: display price + 4% tax ONLY
 */
export const calculatePriceBreakdown = (
  displayPricePerNight: number, 
  nights: number, 
  isPayAtProperty: boolean = false,
  isTour: boolean = false
): PriceBreakdown => {
  const price = displayPricePerNight; // Display price (already includes 10% markup)
  const subtotal = price * nights;
  const cleaningFee = 0; // No cleaning fee
  const serviceFee = 0; // No service fee - taxes only
  
  // 4% tax calculated on display price (which already contains 10% markup)
  const taxes = Math.round(subtotal * PRICING_CONFIG.taxRate);
  
  let total = subtotal + taxes; // Only subtotal + taxes
  let payAtPropertyFee = 0;
  
  if (isPayAtProperty) {
    payAtPropertyFee = Math.round(total * PRICING_CONFIG.payAtPropertyFeeRate);
    total += payAtPropertyFee;
  }
  
  return {
    price,
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
  displayPricePerNight: number,
  nights: number,
  isPayAtProperty: boolean = false,
  isTour: boolean = false
): number => {
  const breakdown = calculatePriceBreakdown(displayPricePerNight, nights, isPayAtProperty, isTour);
  return breakdown.total;
};