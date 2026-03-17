export const DISCOUNT_TYPES = {
  NONE: { label: 'No Discount', value: 0 },
  SENIOR: { label: 'Senior Citizen', value: 0.20 },
  PWD: { label: 'PWD', value: 0.20 },
  PROMO: { label: 'Promotional', value: 0.10 },
};

export const calculateDiscount = (subtotal, type) => {
  const discount = DISCOUNT_TYPES[type] || DISCOUNT_TYPES.NONE;
  const amount = subtotal * discount.value;
  return {
    discountAmount: amount,
    finalTotal: subtotal - amount
  };
};