import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function removeExtension(fileName) {
  // Find the last occurrence of '.' to get the position of the file extension
  const dotIndex = fileName.lastIndexOf(".");

  // If a dot is found and it's not the first character (i.e., not a hidden file), remove the extension
  if (dotIndex !== -1 && dotIndex > 0) {
    return fileName.substring(0, dotIndex);
  }

  // If no extension found or the dot is the first character (hidden file), return the original file name
  return fileName;
}

export const formatDate = (date) => {
  const formattedDate = new Date(date);
  return {
    date: format(formattedDate, "PP"),
    time: format(formattedDate, "p"),
  };
};
