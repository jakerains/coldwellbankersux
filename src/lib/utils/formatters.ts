/**
 * Format a price as USD currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format a number with comma separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format square feet with comma and "sq ft" suffix
 */
export function formatSquareFeet(sqft: number | undefined): string {
  if (!sqft) return "N/A";
  return `${formatNumber(sqft)} sq ft`;
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format beds/baths display
 */
export function formatBedBath(beds: number, baths: number): string {
  return `${beds} bed${beds !== 1 ? "s" : ""} • ${baths} bath${baths !== 1 ? "s" : ""}`;
}

/**
 * Format full address
 */
export function formatAddress(address: {
  street: string;
  city: string;
  state: string;
  zip: string;
}): string {
  return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
}

/**
 * Format short address (street only)
 */
export function formatShortAddress(address: {
  street: string;
  city: string;
  state: string;
}): string {
  return `${address.street}, ${address.city}`;
}

/**
 * Format lot size - handles various formats like "3.54 acres" or "7,405 SQFT"
 */
export function formatLotSize(lotSize: string | undefined): string {
  if (!lotSize) return "N/A";
  return lotSize;
}

/**
 * Format phone number
 */
export function formatPhone(phone: string | undefined): string {
  if (!phone) return "";
  // Already formatted like (712) 255-7310
  if (phone.includes("(")) return phone;
  // Format 10 digit number
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: "Active" | "Pending"): string {
  switch (status) {
    case "Active":
      return "bg-green-500";
    case "Pending":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
