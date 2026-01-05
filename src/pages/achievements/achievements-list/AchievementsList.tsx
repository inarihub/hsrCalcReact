import { FC, memo } from 'react';
import { Achievement } from '../types';
import { AchievementTile } from './AchievementTile';
import classes from '../achievements.module.scss';

interface AchievementsListProps {
    achievements: Achievement[] | null;
    onItemClick: (id: number) => void;
    isCompleted: (id: number) => boolean;
}

export const AchievementsList: FC<AchievementsListProps> = memo(({ achievements, onItemClick, isCompleted }) => {
    if (!achievements.length) {
        return (
            <div className={classes.achContainer}>
                <div
                    className={classes.achievementTile}
                >
                    No achievements
                </div>
            </div>
        )
    }

    return (
        <div className={classes.achContainer}>
            {achievements.map(d => (
                <AchievementTile
                    key={d.id}
                    checked={isCompleted(d.id)}
                    achievement={d}
                    onClick={onItemClick}
                />
            ))}
        </div>
    )
});