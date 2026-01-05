import { FC, useCallback, useMemo } from 'react';
import { Achievement } from '../types';
import classes from '../achievements.module.scss';

interface AchievementTile {
    achievement: Achievement;
    checked: boolean;
    onClick: (id: number) => void;
}

export const AchievementTile: FC<AchievementTile> = ({ achievement, checked, onClick }) => {
    const onTileClick = useCallback(() => {
        console.log(achievement);
        onClick(achievement.id);
    }, []);
    const opacityStyle = useMemo(() => ({ opacity: `${checked ? 0.5 : 1}` }), [checked]);

    const url = useMemo(() => {
        if (!achievement.video) return;

        try {
            const url = new URL(achievement.video);
            return url
        } catch (e) {
            console.error('URL is not valid:', achievement.video);
        }
    }, [achievement]);

    const onCopyClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(achievement.name)
    }, [achievement.name])

    const onLinkClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (!url) return;
        if (url.protocol !== 'https:') return;
        window.open(url);
    }, [url])

    return (
        <div
            className={classes.achievementTile}
            style={opacityStyle}
            onClick={onTileClick}
        >
            <input
                className={classes.input}
                type='checkbox'
                checked={checked}
            />
            <div className={classes.body}>
                <div className={classes.headerGroup}>
                    <label className={classes.name}>
                        {achievement.name}
                    </label>

                    <label className={classes.version}>
                        {`ver.${achievement.version}`}
                    </label>
                </div>

                <div className={classes.buttonsContainer}>
                    <button
                        className={classes.copyBtn}
                        onClick={onCopyClick}
                    >
                        Copy
                    </button>

                    {url && (
                        <button
                            className={classes.linkBtn}
                            onClick={onLinkClick}
                        >
                            See on Youtube
                        </button>
                    )}
                </div>

                <div className={classes.description}>
                    {achievement.description}
                </div>
            </div>
        </div>
    )
}