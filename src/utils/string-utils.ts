/**
 * Generate initials from first and last name
 * @param firstName - First name
 * @param lastName - Last name  
 * @returns Uppercase initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}; 