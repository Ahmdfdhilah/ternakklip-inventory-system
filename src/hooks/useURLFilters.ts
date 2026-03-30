import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type FilterValue = string | number | boolean | undefined | null;

export function useURLFilters<T extends { [key: string]: FilterValue }>(
  defaults?: Partial<T>
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params = {} as T;
    for (const [key, value] of searchParams.entries()) {
      (params as Record<string, string>)[key] = value;
    }
    
    if (defaults) {
      for (const [key, value] of Object.entries(defaults)) {
        if (!(key in params) && value !== undefined && value !== null) {
          (params as Record<string, FilterValue>)[key] = value;
        }
      }
    }

    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : (defaults?.page as number | undefined) ?? 1;
    const limit = searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : (defaults?.limit as number | undefined) ?? 20;

    return { ...params, page, limit } as T & { page: number; limit: number };
  }, [searchParams.toString()]);

  const setFilter = useCallback(
    (key: string, value: FilterValue) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === undefined || value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
          if (key !== 'page') {
            next.delete('page');
          }
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('page');
          for (const [key, value] of Object.entries(updates)) {
            if (value === undefined || value === null || value === '') {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: false });
  }, [setSearchParams]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  };
}
