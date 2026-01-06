import { FC, memo, useCallback, useMemo } from 'react';
import { Achievement } from '../types';
import { AchievementTile } from './AchievementTile';
import { Filters } from '../AchievementFilters';
import classes from '../achievements.module.scss';

interface AchievementsListProps {
    filter: Filters;
    achievements: Achievement[] | null;
    onItemClick: (id: number) => void;
    isCompleted: (id: number) => boolean;
}

export const AchievementsList: FC<AchievementsListProps> = memo(({ filter, achievements, onItemClick, isCompleted }) => {
    const shouldInclude = useCallback((id: number) => {
        const includedByAll = filter === 'All';
        const isComplete = isCompleted(id);
        const includedByCompletion = filter === 'Completed' && isComplete;
        const includedByInProgress = filter === 'In progress' && !isComplete;
        return includedByAll || includedByCompletion || includedByInProgress;
    }, [filter]);

    const list = useMemo(() => {
        return achievements.reduce((acc, d) => {
            const isComplete = isCompleted(d.id);

            if (shouldInclude(d.id)) {
                acc.push(
                    <AchievementTile
                        key={d.id}
                        checked={isComplete}
                        achievement={d}
                        onClick={onItemClick}
                    />
                )
            }
            return acc;
        }, []);
    }, [achievements, shouldInclude, onItemClick, isCompleted]);

    return (
        <div className={classes.achContainer}>
            {list.length ? list : (
                <div className={classes.achievementTile}>
                    No achievements
                </div>
            )}
        </div>
    )
});

export default AchievementsList;