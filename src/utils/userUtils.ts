export function getUserInitials(name: string | null | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function getUserFullName(name: string | null | undefined): string {
  return name ?? '';
}
