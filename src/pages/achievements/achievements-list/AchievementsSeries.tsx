import { FC, useMemo } from 'react';
import { AchievementSeries } from '../types';
import classes from '../achievements.module.scss';

interface AchievementSeriesListProps {
    series: AchievementSeries[];
    active: number;
    onSeriesChange: (series: number) => void;
}

function getTextColor(isActive: boolean) {
    return isActive ? '#77ccff' : '#ffffffaa';
}

export const AchievementSeriesList: FC<AchievementSeriesListProps> = ({ series, active, onSeriesChange }) => {
    const list = useMemo(() => {
        return series.map(g => (
            <div
                key={g.id}
                onClick={() => onSeriesChange(g.id)}
                className={classes.groupContainer}
            >
                <div style={{ color: getTextColor(g.id === active) }}>
                    {g.name}
                </div>
            </div>
        ));
    }, [series, active, onSeriesChange]);

    return (
        <div className={classes.achGroups}>
            {list}
        </div>
    )
}