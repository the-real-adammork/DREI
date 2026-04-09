import type { Property } from '@drei/shared';

export type Filters = {
  status: 'all' | 'Available' | 'Sold Out' | 'Coming Soon';
  minPrice: string;
  maxPrice: string;
  location: string;
};

export const defaultFilters: Filters = {
  status: 'all',
  minPrice: '',
  maxPrice: '',
  location: 'all',
};

export function applyFilters(properties: Property[], filters: Filters, query: string): Property[] {
  let result = [...properties];
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    );
  }
  if (filters.status !== 'all') result = result.filter((p) => p.status === filters.status);
  if (filters.minPrice) result = result.filter((p) => p.price >= Number(filters.minPrice));
  if (filters.maxPrice) result = result.filter((p) => p.price <= Number(filters.maxPrice));
  if (filters.location !== 'all')
    result = result.filter((p) => p.location.includes(filters.location));
  return result;
}

export function isActive(filters: Filters): boolean {
  return (
    filters.status !== 'all' ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    filters.location !== 'all'
  );
}

export function uniqueLocations(properties: Property[]): string[] {
  return Array.from(
    new Set(
      properties
        .map((p) => p?.location?.split(',')[0]?.trim())
        .filter((l): l is string => !!l)
    )
  );
}
