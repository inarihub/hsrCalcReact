import { useCallback, useEffect, useMemo, useState } from 'react';
import { AchievementsList } from './achievements-list/AchievementsList';
import { Achievement, CompletedAchievements } from './types';
import { useAchievements } from './hooks/useAchievements';
import { ImportButton } from './settings/ImportButton';
import { Language, LanguageSelector } from './settings/LanguageSelector';
import { AchievementsFilter, Filters } from './AchievementFilters';
import { AchievementSeriesList } from './achievements-list/AchievementsSeries';
import { CounterLabel } from '../shared/Counter';
import { ExportButton } from './settings/ExportButton';
import classes from '../hsrCalc/HSRCalc.module.scss';

const ACHIEVEMENT_KEY = 'achieves';

interface AchievementsAggregation {
    seriesMap: Map<number, Achievement[]>;
    achievementMap: Map<number, Achievement>;
    total: number;
}

function isAchievementCompleted(checkedList: Set<Achievement['id']>, achievement: Achievement) {
    return checkedList.has(achievement.id) || (achievement.related?.some(id => checkedList.has(id)) ?? false);
}

export const Achievements = () => {
    const [checked, setChecked] = useState<Set<number>>(new Set<number>());
    const [activeSeries, setActiveSeries] = useState<number>(0);
    const [lang, setLang] = useState<Language>('en');
    const [filter, setFilter] = useState<Filters>('In progress');

    useEffect(() => {
        const achieves = localStorage.getItem(ACHIEVEMENT_KEY);

        if (achieves == null) {
            return;
        }

        const storageRecord: CompletedAchievements = JSON.parse(achieves);

        if (storageRecord) {
            setChecked(new Set(storageRecord.hsr_achievements))
            console.log('Storage records are restored');
        }
    }, [])

    const { achievements, series } = useAchievements(lang);
    const ready = achievements != null && series != null;

    const achievementsAggregation: AchievementsAggregation | undefined = useMemo(() => {
        if (!ready) return;

        let total = 0;
        const achievementMap = new Map<number, Achievement>();

        const forMap = series.map(g => ([g.id, []] as [number, Achievement[]]));
        const inProgressGroup: Achievement[] = [];
        const seriesMap = new Map(forMap);

        for (const ach of achievements) {
            const description = ach.description.replace('\\n※', '');
            const achievement = { ...ach, description };
            achievementMap.set(achievement.id, achievement);

            const seriesGroup = seriesMap.get(achievement.series);

            if (!seriesGroup) {
                console.error(`Cannot find seriesGroup for achievement ${achievement.id}`);
                continue;
            }

            const isCompleted = isAchievementCompleted(checked, achievement);

            const filterForCompleted = filter === 'Completed';

            if (isCompleted === filterForCompleted || filter === 'All') {
                seriesGroup.push(achievement);

                // push to 'In progress'
                if (!isCompleted) {
                    inProgressGroup.push(achievement);
                }
            }

            if (!achievement.related || achievement.related.every(id => !achievementMap.has(id))) {
                total++;
            }
        }

        seriesMap.set(0, inProgressGroup.sort((a, b) => a.version > b.version ? 1 : -1));

        return { seriesMap, achievementMap, total };
    }, [achievements, series, filter, ready])


    const isCompleted = useCallback((id: number) => {
        if (!achievementsAggregation) {
            return false;
        }

        const achievement = achievementsAggregation.achievementMap.get(id);

        if (!achievement) {
            return false;
        }

        return isAchievementCompleted(checked, achievement);
    }, [achievementsAggregation, checked])

    const onItemClick = useCallback((id: number) => {
        setChecked(prev => {
            const newChecked = new Set(Array.from(prev));
            if (newChecked.has(id)) newChecked.delete(id);
            else newChecked.add(id);
            return newChecked;
        })
    }, []);

    const onSeriesChange = useCallback((id: number) => setActiveSeries(id), []);
    const onImport = useCallback((data: CompletedAchievements) => {
        const newData = new Set<number>(data.hsr_achievements);
        setChecked(newData);
    }, []);

    const activeSeriesAchievements = useMemo(() => achievementsAggregation?.seriesMap.get(activeSeries) ?? null, [achievementsAggregation, activeSeries]);

    useEffect(() => {
        const exportObj: CompletedAchievements = {
            hsr_achievements: Array.from(checked),
        };

        localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(exportObj));
    }, [checked])

    return (
        <div className={classes.calcMainContainer}>
            <div className={classes.row}>
                <div className={classes.column}>
                    <div className={classes.row}>
                        <div>
                            <ImportButton onImport={onImport} />
                            <ExportButton checked={checked} />
                        </div>
                        <LanguageSelector lang={lang} onLangChange={setLang} />
                    </div>
                    {ready && (
                        <AchievementSeriesList
                            series={series}
                            active={activeSeries}
                            onSeriesChange={onSeriesChange}
                        />
                    )}
                </div>
                {ready && achievementsAggregation
                    ? (
                        <div key='list' className={classes.column}>
                            <div className={classes.row}>
                                <AchievementsFilter filter={filter} onFilterChange={setFilter} />
                                <CounterLabel current={checked.size} total={Number(achievementsAggregation?.total)} />
                            </div>
                            <AchievementsList
                                achievements={activeSeriesAchievements}
                                onItemClick={onItemClick}
                                isCompleted={isCompleted}
                            />
                        </div>
                    )
                    : <label key='loading'>Loading...</label>
                }
            </div>
        </div>
    )
}