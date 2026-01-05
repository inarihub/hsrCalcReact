import { FC, memo, useCallback, useMemo } from 'react';

const FILTERS = ['Completed', 'In progress', 'All'] as const;
export type Filters = typeof FILTERS[number];

interface AchievementsFilterProps {
    filter: Filters;
    onFilterChange: (filter: Filters) => void;
}

export const AchievementsFilter: FC<AchievementsFilterProps> = memo(({ filter, onFilterChange }) => {
    const getActiveStyle = useCallback((predicate: boolean) => {
        return predicate ? { border: '1px solid #22aaff' } : { color: 'grey' };
    }, [])

    const filters = useMemo(() => {
        return (
            FILTERS.map(f => (
                <button
                    key={f}
                    onClick={() => onFilterChange(f)}
                    style={getActiveStyle(filter === f)}
                    disabled={filter === f}>
                    {f}
                </button>
            ))
        )
    }, [filter, onFilterChange, getActiveStyle]);

    return <div>{filters}</div>;
});