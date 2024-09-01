// lib/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define the colors object
export const colors = [
  "#FF5733", // Example colors
  "#33FF57",
  "#3357FF",
  "#F5A623",
  "#9B51E0",
];

// Utility function to merge class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
