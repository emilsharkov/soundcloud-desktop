import { useMemo, useState } from 'react';

interface UseSearchFilterOptions<T> {
    items: T[] | undefined;
    getSearchText: (item: T) => string;
    initialQuery?: string;
}

export const useSearchFilter = <T>(options: UseSearchFilterOptions<T>) => {
    const { items, getSearchText, initialQuery = '' } = options;
    const [query, setQuery] = useState(initialQuery);

    const normalizedQuery = query.trim().toLowerCase();
    const filteredItems = useMemo(() => {
        if (!items) {
            return [];
        }
        if (!normalizedQuery) {
            return items;
        }
        return items.filter(item =>
            getSearchText(item).toLowerCase().includes(normalizedQuery)
        );
    }, [items, getSearchText, normalizedQuery]);

    return {
        query,
        setQuery,
        normalizedQuery,
        filteredItems,
    };
};
